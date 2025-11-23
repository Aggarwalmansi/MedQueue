const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const calculateScore = (hospital, query) => {
    let score = 0;
    const q = query.toLowerCase();

    console.log(`Scoring hospital: ${hospital.name} for query: ${q}`);
    console.log(`bedsOxygen: ${hospital.bedsOxygen}`);

    // 1. Name Match (Highest Priority)
    if (hospital.name.toLowerCase() === q) score += 100;
    else if (hospital.name.toLowerCase().startsWith(q)) score += 80;
    else if (hospital.name.toLowerCase().includes(q)) score += 60;

    // 2. Specialization Match
    if (hospital.specializations && Array.isArray(hospital.specializations)) {
        const hasSpec = hospital.specializations.some(s =>
            s.department && s.department.toLowerCase().includes(q)
        );
        if (hasSpec) score += 70;
    }

    // 3. Facility/Equipment Match (Diagnostics, Critical Care)
    const checkJson = (jsonObj) => {
        if (!jsonObj) return false;
        return Object.keys(jsonObj).some(key =>
            key.toLowerCase().includes(q) && jsonObj[key] === true
        );
    };

    if (checkJson(hospital.diagnostics)) score += 50;
    if (checkJson(hospital.criticalCare)) score += 50;
    if (checkJson(hospital.supportServices)) score += 30;

    // 4. Bed Type Match
    if (q.includes('icu') && hospital.bedsICU > 0) {
        console.log('Matched ICU');
        score += 40;
    }
    if (q.includes('ventilator') && hospital.criticalCare?.ventilators) {
        console.log('Matched Ventilator');
        score += 40;
    }
    if (q.includes('oxygen') && hospital.bedsOxygen > 0) {
        console.log('Matched Oxygen');
        score += 40;
    }
    if (q.includes('general') && hospital.bedsGeneral > 0) {
        console.log('Matched General');
        score += 40;
    }

    console.log(`Final Score: ${score}`);
    return score;
};

async function main() {
    const q = "oxygen";

    const hospitals = await prisma.hospital.findMany({
        where: { isVerified: true },
        include: {
            manager: { select: { email: true, phone: true } },
            ratings: true
        }
    });

    const results = hospitals.map(h => {
        const score = calculateScore(h, q);
        return { ...h, searchScore: score };
    })
        .filter(h => h.searchScore > 0)
        .sort((a, b) => b.searchScore - a.searchScore);

    console.log('Results:', JSON.stringify(results, null, 2));
}

main();
