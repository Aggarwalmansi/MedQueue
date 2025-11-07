const express = require("express")
const { PrismaClient } = require("@prisma/client")
const router = express.Router()
const prisma = new PrismaClient()

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// GET /api/search/hospitals
// Query Parameters: latitude (Float), longitude (Float), bedType (String, optional), radius (Number, optional)
// Returns: Array of hospitals sorted by distance with available beds filtered by type
router.get("/hospitals", async (req, res) => {
  try {
    const { latitude, longitude, bedType, radius } = req.query

    // Validate required parameters
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      })
    }

    const lat = Number.parseFloat(latitude)
    const lng = Number.parseFloat(longitude)
    const searchRadius = Number.parseInt(radius) || 50 // Default 50 km radius
    const parsedBedType = bedType ? bedType.toUpperCase() : null

    // Fetch all hospitals with their beds
    const hospitals = await prisma.hospital.findMany({
      include: {
        beds: {
          where: {
            status: "AVAILABLE",
            ...(parsedBedType && { type: parsedBedType }),
          },
          select: {
            id: true,
            type: true,
            status: true,
            bedNumber: true,
          },
        },
      },
    })

    // Calculate distance and filter by radius
    const resultsWithDistance = hospitals
      .map((hospital) => {
        const distance = calculateDistance(lat, lng, hospital.latitude, hospital.longitude)
        return {
          id: hospital.id,
          name: hospital.name,
          address: hospital.address,
          contactPhone: hospital.contactPhone,
          latitude: hospital.latitude,
          longitude: hospital.longitude,
          distance: Number.parseFloat(distance.toFixed(2)),
          totalAvailableBeds: hospital.beds.length,
          availableBedsByType: hospital.beds.reduce((acc, bed) => {
            acc[bed.type] = (acc[bed.type] || 0) + 1
            return acc
          }, {}),
          beds: hospital.beds,
        }
      })
      .filter((h) => h.distance <= searchRadius && h.totalAvailableBeds > 0)
      .sort((a, b) => a.distance - b.distance)

    res.json({
      success: true,
      count: resultsWithDistance.length,
      radius: searchRadius,
      data: resultsWithDistance,
    })
  } catch (error) {
    console.error("Search error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to search hospitals",
    })
  }
})

module.exports = router
