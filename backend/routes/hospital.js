const express = require("express")
const { PrismaClient } = require("@prisma/client")
const { authMiddleware, roleMiddleware } = require("../middleware/auth")
const router = express.Router()
const prisma = new PrismaClient()

router.get("/all", async (req, res) => {
  try {
    const hospitals = await prisma.hospital.findMany({
      include: {
        beds: {
          select: {
            id: true,
            status: true,
            type: true,
            bedNumber: true,
          },
        },
      },
    })

    // Calculate available beds for each hospital
    const hospitalData = hospitals.map((hospital) => ({
      ...hospital,
      totalBeds: hospital.beds.length,
      availableBeds: hospital.beds.filter((b) => b.status === "AVAILABLE").length,
    }))

    res.json(hospitalData)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hospitals" })
  }
})

router.get("/nearest", async (req, res) => {
  try {
    const { latitude, longitude, radius } = req.query
    const defaultRadius = 50
    const parsedRadius = radius ? Number.parseInt(radius) : defaultRadius

    if (!latitude || !longitude) {

  const hospitals = await prisma.hospital.findMany();
  return res.json({ success: true, count: hospitals.length, data: hospitals });
}


    const lat = Number.parseFloat(latitude)
    const lng = Number.parseFloat(longitude)

    // Fetch all hospitals and calculate distance
    const hospitals = await prisma.hospital.findMany({
      include: {
        beds: {
          select: {
            id: true,
            status: true,
            type: true,
          },
        },
      },
    })

    // Haversine formula to calculate distance
    const haversine = (lat1, lon1, lat2, lon2) => {
      const R = 6371 // Earth radius in km
      const dLat = ((lat2 - lat1) * Math.PI) / 180
      const dLon = ((lon2 - lon1) * Math.PI) / 180
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      return R * c
    }

    const nearbyHospitals = hospitals
      .map((hospital) => ({
        ...hospital,
        distance: haversine(lat, lng, hospital.latitude, hospital.longitude),
        totalBeds: hospital.beds.length,
        availableBeds: hospital.beds.filter((b) => b.status === "AVAILABLE").length,
      }))
      .filter((h) => h.distance <= parsedRadius)
      .sort((a, b) => a.distance - b.distance)

    res.json(nearbyHospitals)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch nearby hospitals" })
  }
})

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const hospital = await prisma.hospital.findUnique({
      where: { id: req.params.id },
      include: {
        beds: true,
        managers: {
          select: { id: true, email: true, role: true },
        },
      },
    })

    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" })
    }

    res.json(hospital)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hospital" })
  }
})

router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Only admins can create hospitals" })
    }

    const { name, address, contactPhone, latitude, longitude } = req.body

    if (!name || !address || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const hospital = await prisma.hospital.create({
      data: {
        name,
        address,
        contactPhone,
        latitude: Number.parseFloat(latitude),
        longitude: Number.parseFloat(longitude),
      },
    })

    res.status(201).json(hospital)
  } catch (error) {
    res.status(500).json({ error: "Failed to create hospital" })
  }
})

router.put("/:id",  authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Only admins can update hospitals" })
    }

    const { name, address, contactPhone, latitude, longitude } = req.body

    const hospital = await prisma.hospital.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(address && { address }),
        ...(contactPhone && { contactPhone }),
        ...(latitude !== undefined && { latitude: Number.parseFloat(latitude) }),
        ...(longitude !== undefined && { longitude: Number.parseFloat(longitude) }),
      },
    })

    res.json(hospital)
  } catch (error) {
    res.status(500).json({ error: "Failed to update hospital" })
  }
})

module.exports = router
