const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { getDistanceFromLatLonInKm } = require('../utils/distance'); // Assuming this util exists or I'll create it


const parseQuery = (query) => {
    const q = query.toLowerCase().trim();
    const result = {
        original: q,
        specialty: null,
        bedType: null,
        location: null,
        keywords: []
    };


    if (q.includes('icu') || q.includes('intensive')) result.bedType = 'ICU';
    else if (q.includes('ventilator') || q.includes('vent')) result.bedType = 'Ventilator';
    else if (q.includes('oxygen') || q.includes('o2')) result.bedType = 'Oxygen';
    else if (q.includes('general') || q.includes('ward')) result.bedType = 'General';


    const specialties = ['cardiac', 'heart', 'neuro', 'brain', 'ortho', 'bone', 'pediatric', 'child', 'cancer', 'onco', 'kidney', 'renal'];
    const specMap = {
        'heart': 'Cardiology', 'cardiac': 'Cardiology',
        'brain': 'Neurology', 'neuro': 'Neurology',
        'bone': 'Orthopedics', 'ortho': 'Orthopedics',
        'child': 'Pediatrics', 'pediatric': 'Pediatrics',
        'cancer': 'Oncology', 'onco': 'Oncology',
        'kidney': 'Nephrology', 'renal': 'Nephrology'
    };

    for (const s of specialties) {
        if (q.includes(s)) {
            result.specialty = specMap[s] || s.charAt(0).toUpperCase() + s.slice(1);
            break;
        }
    }


    const locationMatch = q.match(/in\s+([a-z\s]+)/);
    if (locationMatch) {
        result.location = locationMatch[1].trim();
    }

    return result;
};


const calculateScore = (hospital, parsedQuery) => {
    let score = 0;
    const { original, specialty, bedType, location } = parsedQuery;


    if (specialty) {
        if (hospital.specializations && Array.isArray(hospital.specializations)) {
            const hasSpec = hospital.specializations.some(s =>
                s.department && s.department.toLowerCase().includes(specialty.toLowerCase())
            );
            if (hasSpec) score += 150;
        }
    }


    if (bedType) {
        if (bedType === 'ICU' && hospital.bedsICU > 0) score += 100;
        if (bedType === 'Ventilator' && hospital.criticalCare?.ventilators) score += 100;
        if (bedType === 'Oxygen' && hospital.bedsOxygen > 0) score += 100;
        if (bedType === 'General' && hospital.bedsGeneral > 0) score += 100;
    }


    if (location) {
        if (hospital.city && hospital.city.toLowerCase().includes(location)) score += 80;
        if (hospital.address && hospital.address.toLowerCase().includes(location)) score += 60;
    }


    if (hospital.name.toLowerCase().includes(original)) score += 50;


    const synonyms = {
        'er': 'emergency',
        'casualty': 'emergency',
        'scan': 'diagnostics'
    };

    Object.keys(synonyms).forEach(key => {
        if (original.includes(key)) {
            // Check facilities
            if (hospital.diagnostics && JSON.stringify(hospital.diagnostics).toLowerCase().includes(synonyms[key])) score += 30;
        }
    });

    return score;
};

exports.searchHospitals = async (req, res) => {
    try {
        const { q, lat, lng, page = 1, limit = 10, sortBy } = req.query;
        // if (!q) return res.json({ hospitals: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } });

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const parsedQuery = q ? parseQuery(q) : {};
        console.log('[DEBUG] Parsed Query:', parsedQuery);

        // Fetch all verified hospitals
        const hospitals = await prisma.hospital.findMany({
            where: { isVerified: true },
            include: {
                manager: { select: { email: true, phone: true } },
                ratings: true
            }
        });

        // Filter and Score
        let results = hospitals.map(h => {
            let score = 0;
            if (q) {
                score = calculateScore(h, parsedQuery);
            } else {
                score = 1; // Default score if no query, to show all
            }

            // Calculate distance if location provided
            let distance = null;
            if (lat && lng) {
                distance = getDistanceFromLatLonInKm(
                    parseFloat(lat), parseFloat(lng),
                    h.latitude, h.longitude
                );
            }

            // Calculate average rating
            const avgRating = h.ratings.length > 0
                ? h.ratings.reduce((acc, r) => acc + r.value, 0) / h.ratings.length
                : 0;

            return { ...h, searchScore: score, distance, averageRating };
        })
            .filter(h => h.searchScore > 0);

        // Sorting Logic
        if (sortBy === 'trending') {
            results.sort((a, b) => b.averageRating - a.averageRating);
        } else if (sortBy === 'rating') {
            results.sort((a, b) => b.averageRating - a.averageRating);
        } else if (sortBy === 'distance' && lat && lng) {
            results.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
        } else {
            // Default sort by search score
            results.sort((a, b) => b.searchScore - a.searchScore);
        }

        // Mark top 5 as trending if sorted by trending
        if (sortBy === 'trending') {
            results = results.map((h, index) => ({
                ...h,
                isTrending: index < 5 && h.averageRating >= 4.0 // Top 5 and rating >= 4.0
            }));
        }

        // Paginate
        const totalResults = results.length;
        const paginatedResults = results.slice(skip, skip + limitNum);

        res.json({
            hospitals: paginatedResults,
            pagination: {
                total: totalResults,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(totalResults / limitNum)
            }
        });

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
exports.getTrendingHospitals = async (req, res) => {
    try {
        // Fetch hospitals with ratings
        const hospitals = await prisma.hospital.findMany({
            where: { isVerified: true },
            include: {
                manager: { select: { email: true, phone: true } },
                ratings: true
            }
        });

        // Calculate average rating and sort in memory
        const trending = hospitals.map(h => {
            const avgRating = h.ratings.length > 0
                ? h.ratings.reduce((acc, r) => acc + r.value, 0) / h.ratings.length
                : 0;
            return { ...h, averageRating: avgRating, isTrending: true };
        })
            .sort((a, b) => b.averageRating - a.averageRating)
            .slice(0, 5);

        res.json(trending);
    } catch (error) {
        console.error('Trending error:', error);
        res.status(500).json({ message: 'Failed to fetch trending hospitals' });
    }
};

exports.getRecommendedHospitals = async (req, res) => {
    try {
        const hospitals = await prisma.hospital.findMany({
            where: { isVerified: true },
            take: 10,
            include: {
                manager: { select: { email: true, phone: true } },
                ratings: true
            }
        });

        // Pick 3 random ones as "Recommended"
        const shuffled = hospitals.sort(() => 0.5 - Math.random());
        const recommended = shuffled.slice(0, 3).map(h => ({
            ...h,
            recommendationReason: ['Similar to your recent search', 'Highly rated in your area', 'Popular for Cardiology'][Math.floor(Math.random() * 3)]
        }));

        res.json(recommended);
    } catch (error) {
        console.error('Recommendation error:', error);
        res.status(500).json({ message: 'Failed to fetch recommendations' });
    }
};
