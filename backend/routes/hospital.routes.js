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
            const totalBeds = updatedHospital.bedsGeneral + updatedHospital.bedsICU + updatedHospital.bedsOxygen;
            const hospitalWithTotalBeds = { ...updatedHospital, totalBeds };

            // Emit to the specific hospital room (for manager dashboard)
            req.io.to(`hospital_${hospital.id}`).emit('hospital_updated', updatedHospital);
            // Emit globally (for patient search page)
            req.io.emit('hospital_updated_public', hospitalWithTotalBeds);
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

// PUT /api/hospital/er-wait-times - Update ER wait times (Manager only)
router.put('/er-wait-times', async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const hospital = await prisma.hospital.findUnique({
            where: { managerId: userId }
        });

        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        const { critical, moderate, nonUrgent } = req.body;

        const updatedHospital = await prisma.hospital.update({
            where: { id: hospital.id },
            data: {
                erWaitTimes: {
                    critical,
                    moderate,
                    nonUrgent,
                    lastUpdated: new Date()
                }
            }
        });

        // Emit real-time update
        if (req.io) {
            req.io.emit('er_wait_times_updated', {
                hospitalId: hospital.id,
                erWaitTimes: updatedHospital.erWaitTimes
            });
        }

        res.json({ message: 'ER wait times updated', erWaitTimes: updatedHospital.erWaitTimes });
    } catch (error) {
        console.error('Error updating ER wait times:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/hospital/virtual-queue - View active virtual queue (Manager only)
router.get('/virtual-queue', async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const hospital = await prisma.hospital.findUnique({
            where: { managerId: userId }
        });

        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        const queue = await prisma.virtualQueueEntry.findMany({
            where: {
                hospitalId: hospital.id,
                status: 'WAITING'
            },
            orderBy: [
                { severity: 'desc' }, // CRITICAL first
                { checkInTime: 'asc' }
            ]
        });

        res.json(queue);
    } catch (error) {
        console.error('Error fetching virtual queue:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PATCH /api/hospital/virtual-queue/:id/status - Update queue entry status
router.patch('/virtual-queue/:id/status', async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const { id } = req.params;
        const { status } = req.body;

        if (!['WAITING', 'CALLED', 'COMPLETED', 'EXPIRED', 'CANCELLED'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const entry = await prisma.virtualQueueEntry.update({
            where: { id: parseInt(id) },
            data: { status }
        });

        // Emit real-time update
        if (req.io) {
            req.io.emit('queue_entry_updated', entry);
        }

        res.json({ message: 'Queue entry updated', entry });
    } catch (error) {
        console.error('Error updating queue entry:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
