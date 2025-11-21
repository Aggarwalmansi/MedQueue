const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get Hospital Profile (Manager's View)
router.get('/profile', async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const hospital = await prisma.hospital.findUnique({
            where: { managerId: userId }
        });

        if (!hospital) return res.status(404).json({ message: 'Hospital not found' });

        res.json(hospital);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Inventory (Bed Counts)
router.patch('/inventory', async (req, res) => {
    try {
        const { bedsGeneral, bedsICU, bedsOxygen, doctorsActive } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const hospital = await prisma.hospital.findUnique({
            where: { managerId: userId }
        });

        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found for this manager' });
        }

        const updatedHospital = await prisma.hospital.update({
            where: { id: hospital.id },
            data: {
                bedsGeneral,
                bedsICU,
                bedsOxygen,
                doctorsActive
            }
        });

        // Emit real-time update
        if (req.io) {
            // Emit to the specific hospital room (for manager dashboard)
            req.io.to(`hospital_${hospital.id}`).emit('hospital_updated', updatedHospital);
            // Emit globally (for patient search page)
            req.io.emit('hospital_updated_public', updatedHospital);
        }

        res.json({ message: 'Inventory updated', hospital: updatedHospital });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Incoming Bookings
router.get('/bookings', async (req, res) => {
    try {
        let hospitalId;

        if (req.query.hId) {
            hospitalId = parseInt(req.query.hId);
        } else if (req.user?.userId) {
            const hospital = await prisma.hospital.findUnique({
                where: { managerId: req.user.userId }
            });
            hospitalId = hospital?.id;
        }

        if (!hospitalId) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        const bookings = await prisma.booking.findMany({
            where: {
                hospitalId: hospitalId,
                status: req.query.status || 'INCOMING'
            },
            orderBy: { createdAt: 'desc' },
            include: { user: true }
        });

        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Booking Status (Admit/Divert)
router.patch('/bookings/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // ADMITTED, DIVERTED, CANCELLED

        if (!['ADMITTED', 'DIVERTED', 'CANCELLED'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const booking = await prisma.booking.update({
            where: { id: parseInt(id) },
            data: { status }
        });

        // Emit real-time update
        if (req.io) {
            req.io.to(`hospital_${booking.hospitalId}`).emit('booking_updated', booking);
        }

        res.json({ message: `Booking ${status}`, booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
