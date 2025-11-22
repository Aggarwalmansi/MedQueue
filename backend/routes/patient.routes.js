const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Helper to calculate distance (Haversine formula)
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

// GET /api/patient/hospitals
// Query params: lat, lng
router.get('/hospitals', async (req, res) => {
    try {
        const { lat, lng } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ message: 'Latitude and Longitude are required' });
        }

        const userLat = parseFloat(lat);
        const userLng = parseFloat(lng);

        // Fetch all hospitals
        const hospitals = await prisma.hospital.findMany({
            where: { isVerified: true },
            include: {
                manager: {
                    select: {
                        email: true,
                        phone: true
                    }
                }
            }
        });

        // Calculate distance and viability score
        const processedHospitals = hospitals.map(hospital => {
            const distance = getDistanceFromLatLonInKm(userLat, userLng, hospital.latitude, hospital.longitude);
            const totalBeds = hospital.bedsGeneral + hospital.bedsICU + hospital.bedsOxygen;

            // Viability Score Logic:
            // Lower distance is better. Higher beds is better.
            // Simple formula: (Beds * 10) - (Distance * 2)
            // We can tweak weights.
            // If beds = 0, score should be very low.

            let viabilityScore = 0;
            if (totalBeds > 0) {
                viabilityScore = (totalBeds * 10) - (distance * 5);
            } else {
                viabilityScore = -1000 - distance; // Push to bottom
            }

            return {
                ...hospital,
                distance: parseFloat(distance.toFixed(2)),
                totalBeds,
                viabilityScore
            };
        });

        // Filter out hospitals with 0 beds (optional per requirements, but "Viability Score" implies sorting)
        // Requirement says: "A hospital 2km away with 0 beds is ranked lower than a hospital 4km away with 5 beds."
        // So we keep them but rank them lower.

        // Sort by Viability Score descending
        processedHospitals.sort((a, b) => b.viabilityScore - a.viabilityScore);

        res.json(processedHospitals);

    } catch (error) {
        console.error('Error fetching hospitals:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/patient/hospitals/:id
router.get('/hospitals/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const hospital = await prisma.hospital.findUnique({
            where: { id: parseInt(id) }
        });

        if (!hospital || !hospital.isVerified) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        res.json(hospital);
    } catch (error) {
        console.error('Error fetching hospital details:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/patient/bookings
router.post('/bookings', async (req, res) => {
    try {
        const { hospitalId, patientName, patientPhone, condition, severity } = req.body;

        if (!hospitalId || !patientName || !patientPhone || !condition) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const booking = await prisma.booking.create({
            data: {
                hospitalId: parseInt(hospitalId),
                patientName,
                patientPhone,
                condition,
                severity: severity || 'MODERATE',
                status: 'INCOMING'
                // userId is optional now
            }
        });

        // Emit real-time update to the hospital room
        if (req.io) {
            req.io.to(`hospital_${hospitalId}`).emit('new_booking', booking);
        }

        res.status(201).json({ message: 'Booking created successfully', booking });

    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

const authMiddleware = require('../middleware/authMiddleware');

// GET /api/patient/my-bookings
router.get('/my-bookings', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        const bookings = await prisma.booking.findMany({
            where: { userId: userId },
            include: {
                hospital: {
                    select: {
                        name: true,
                        address: true,
                        phone: true,
                        latitude: true,
                        longitude: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(bookings);
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
