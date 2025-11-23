// Helper function to calculate hospital profile completeness
// Returns a score from 0-100 based on filled facility fields

function calculateProfileCompleteness(hospital) {
    let score = 0;

    // Basic info (20%) - always present for verified hospitals
    score += 20;

    // Specializations (30%)
    if (hospital.specializations && Array.isArray(hospital.specializations) && hospital.specializations.length > 0) {
        score += 30;
    }

    // Diagnostics (15%)
    if (hospital.diagnostics) {
        const diagnostics = hospital.diagnostics;
        const hasAny = diagnostics.mri?.available || diagnostics.ctScan?.available ||
            diagnostics.xRay?.available || diagnostics.ultrasound?.available;
        if (hasAny) score += 15;
    }

    // Critical Care (20%)
    if (hospital.criticalCare) {
        const care = hospital.criticalCare;
        const hasAny = care.ventilators || care.dialysis || care.bloodBank?.available ||
            (care.icuTypes && care.icuTypes.length > 0);
        if (hasAny) score += 20;
    }

    // Support Services (10%)
    if (hospital.supportServices) {
        const services = hospital.supportServices;
        const count = Object.values(services).filter(v => v === true || (typeof v === 'object' && v.available)).length;
        if (count > 0) score += 10;
    }

    // Accreditations (5%)
    if (hospital.accreditations && Array.isArray(hospital.accreditations) && hospital.accreditations.length > 0) {
        score += 5;
    }

    return Math.min(score, 100);
}

module.exports = { calculateProfileCompleteness };
