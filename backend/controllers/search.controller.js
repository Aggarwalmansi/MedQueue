const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { getDistanceFromLatLonInKm } = require('../utils/distance'); // Assuming this util exists or I'll create it

// Helper for fuzzy matching (simple includes for now, can be enhanced)
const calculateScore = (hospital, query) => {
    let score = 0;
    const q = query.toLowerCase().trim();

    // Synonyms Map
    const synonyms = {
        'o2': 'oxygen',
        'er': 'emergency',
        'casualty': 'emergency',
        'heart': 'cardio',
        'kidney': 'nephro',
        'lungs': 'pulmo',
        'cancer': 'onco',
        'xray': 'x-ray',
        'scan': 'diagnostics'
    };

    // Check query against synonyms
    let effectiveQueries = [q];
    Object.keys(synonyms).forEach(key => {
        if (q.includes(key)) {
            effectiveQueries.push(q.replace(key, synonyms[key]));
        }
    });

    // Helper to check any of the effective queries
    const matches = (text) => {
        if (!text) return false;
        const lowerText = text.toLowerCase();
        return effectiveQueries.some(eq => lowerText.includes(eq));
    };

    // 1. Name Match (Highest Priority)
    if (matches(hospital.name)) score += 100;

    // 2. Address/City Match
    if (matches(hospital.city)) score += 60;
    if (matches(hospital.address)) score += 50;

    // 3. Specialization Match
    if (hospital.specializations && Array.isArray(hospital.specializations)) {
        const hasSpec = hospital.specializations.some(s =>
            matches(s.department) ||
            (s.keyEquipment && s.keyEquipment.some(eq => matches(eq)))
        );
        if (hasSpec) score += 70;
    }

    // 4. Facility/Equipment Match (Diagnostics, Critical Care, Support)
    const checkJson = (jsonObj) => {
        if (!jsonObj) return false;
        return Object.keys(jsonObj).some(key =>
            matches(key) && jsonObj[key] === true
        );
    };

    if (checkJson(hospital.diagnostics)) score += 50;
    if (checkJson(hospital.criticalCare)) score += 50;
    if (checkJson(hospital.supportServices)) score += 30;

    // 5. Bed Type Match (Partial & Synonym Aware)
    // Check if query matches "icu" or "intensive"
    if ((matches('icu') || matches('intensive')) && hospital.bedsICU > 0) score += 40;

    // Check if query matches "ventilator"
    if (matches('ventilator') && hospital.criticalCare?.ventilators) score += 40;

    // Check if query matches "oxygen" or "o2"
    if ((matches('oxygen') || matches('o2')) && hospital.bedsOxygen > 0) score += 40;

    // Check if query matches "general" or "ward"
    if ((matches('general') || matches('ward')) && hospital.bedsGeneral > 0) score += 40;

    return score;
};

exports.searchHospitals = async (req, res) => {
    try {
        const { q, lat, lng } = req.query;
        if (!q) return res.json([]);

        // Fetch all verified hospitals (optimization: select only needed fields)
        const hospitals = await prisma.hospital.findMany({
            where: { isVerified: true },
            include: {
                manager: { select: { email: true, phone: true } },
                ratings: true
            }
        });

        // Filter and Score
        const results = hospitals.map(h => {
            const score = calculateScore(h, q);
            console.log(`[DEBUG] Hospital: ${h.name}, Query: ${q}, Score: ${score}`);

            // Calculate distance if location provided
            let distance = null;
            if (lat && lng) {
                distance = getDistanceFromLatLonInKm(
                    parseFloat(lat), parseFloat(lng),
                    h.latitude, h.longitude
                );
                // Distance penalty: -1 score per km (optional)
                // score -= distance; 
            }

            return { ...h, searchScore: score, distance };
        })
            .filter(h => h.searchScore > 0)
            .sort((a, b) => b.searchScore - a.searchScore);

        res.json(results);

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Search failed' });
    }
};

exports.getSuggestions = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.length < 2) return res.json({});

        const hospitals = await prisma.hospital.findMany({
            where: { isVerified: true },
            select: {
                name: true,
                specializations: true,
                diagnostics: true,
                criticalCare: true
            }
        });

        const suggestions = {
            hospitals: [],
            specializations: new Set(),
            facilities: new Set(),
            bedTypes: new Set()
        };

        const lowerQ = q.toLowerCase();

        hospitals.forEach(h => {
            // Hospital Names
            if (h.name.toLowerCase().includes(lowerQ)) {
                suggestions.hospitals.push({ name: h.name, id: h.id });
            }

            // Specializations
            if (h.specializations && Array.isArray(h.specializations)) {
                h.specializations.forEach(s => {
                    if (s.department && s.department.toLowerCase().includes(lowerQ)) {
                        suggestions.specializations.add(s.department);
                    }
                });
            }

            // Facilities (Diagnostics & Critical Care)
            const checkAndAdd = (obj, set) => {
                if (!obj) return;
                Object.keys(obj).forEach(key => {
                    if (key.toLowerCase().includes(lowerQ)) set.add(key);
                });
            };
            checkAndAdd(h.diagnostics, suggestions.facilities);
            checkAndAdd(h.criticalCare, suggestions.facilities);

            // Bed Types (Hardcoded check based on query)
            if ('icu'.includes(lowerQ)) suggestions.bedTypes.add('ICU Beds');
            if ('oxygen'.includes(lowerQ)) suggestions.bedTypes.add('Oxygen Beds');
            if ('ventilator'.includes(lowerQ)) suggestions.bedTypes.add('Ventilator');
            if ('general'.includes(lowerQ)) suggestions.bedTypes.add('General Beds');
        });

        res.json({
            hospitals: suggestions.hospitals.slice(0, 3),
            specializations: Array.from(suggestions.specializations).slice(0, 3),
            facilities: Array.from(suggestions.facilities).slice(0, 3),
            bedTypes: Array.from(suggestions.bedTypes)
        });

    } catch (error) {
        console.error('Suggestion error:', error);
        res.status(500).json({ message: 'Suggestion failed' });
    }
};
