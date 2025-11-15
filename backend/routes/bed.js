const express = require("express")
const { PrismaClient } = require("@prisma/client")
const { authMiddleware, roleMiddleware } = require("../middleware/auth")
const router = express.Router()
const prisma = new PrismaClient()

router.get("/hospital/:hospitalId", authMiddleware, async (req, res) => {
  try {

    if (req.user.role === "HOSPITAL_MANAGER" && req.user.hospitalId !== req.params.hospitalId) {
      return res.status(403).json({ error: "Unauthorized" })
    }

    const beds = await prisma.bed.findMany({
      where: { hospitalId: req.params.hospitalId },
      orderBy: [{ bedNumber: "asc" }],
    })

    res.json(beds)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch beds" })
  }
})

router.get("/stats/:hospitalId", authMiddleware, async (req, res) => {
  try {
    if (req.user.role === "HOSPITAL_MANAGER" && req.user.hospitalId !== req.params.hospitalId) {
      return res.status(403).json({ error: "Unauthorized" })
    }

    const beds = await prisma.bed.groupBy({
      by: ["status", "type"],
      where: { hospitalId: req.params.hospitalId },
      _count: true,
    })

    const summary = {
      total: 0,
      available: 0,
      occupied: 0,
      cleaning: 0,
      maintenance: 0,
      byType: {},
    }

    beds.forEach((bed) => {
      summary.total += bed._count
      summary[bed.status.toLowerCase()] = bed._count
      if (!summary.byType[bed.type]) {
        summary.byType[bed.type] = { total: 0, available: 0 }
      }
      summary.byType[bed.type].total += bed._count
      if (bed.status === "AVAILABLE") {
        summary.byType[bed.type].available += bed._count
      }
    })

    res.json(summary)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bed statistics" })
  }
})

router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "HOSPITAL_MANAGER") {
      return res.status(403).json({ error: "Only managers can create beds" })
    }

    const { type, bedNumber, hospitalId } = req.body

    // Verify manager owns this hospital
    if (req.user.hospitalId !== hospitalId) {
      return res.status(403).json({ error: "Unauthorized" })
    }

    if (!type || !bedNumber) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const bed = await prisma.bed.create({
      data: {
        type,
        bedNumber,
        hospitalId,
        status: "AVAILABLE",
      },
    })

    res.status(201).json(bed)
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Bed number already exists for this hospital" })
    }
    res.status(500).json({ error: "Failed to create bed" })
  }
})

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body

    const bed = await prisma.bed.findUnique({
      where: { id: req.params.id },
      include: { hospital: true },
    })

    if (!bed) {
      return res.status(404).json({ error: "Bed not found" })
    }

    if (req.user.role === "HOSPITAL_MANAGER" && req.user.hospitalId !== bed.hospitalId) {
      return res.status(403).json({ error: "Unauthorized" })
    }

    const updatedBed = await prisma.bed.update({
      where: { id: req.params.id },
      data: { status },
    })

    res.json(updatedBed)
  } catch (error) {
    res.status(500).json({ error: "Failed to update bed" })
  }
})

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const bed = await prisma.bed.findUnique({
      where: { id: req.params.id },
    })

    if (!bed) {
      return res.status(404).json({ error: "Bed not found" })
    }

    if (req.user.role === "HOSPITAL_MANAGER" && req.user.hospitalId !== bed.hospitalId) {
      return res.status(403).json({ error: "Unauthorized" })
    }

    await prisma.bed.delete({
      where: { id: req.params.id },
    })

    res.json({ message: "Bed deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: "Failed to delete bed" })
  }
})

module.exports = router
