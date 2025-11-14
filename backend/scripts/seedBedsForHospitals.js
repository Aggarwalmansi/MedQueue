// const path = require("path")
// const { PrismaClient } = require("@prisma/client")

// const prisma = new PrismaClient()

// // Define realistic bed distributions per hospital
// const BED_TYPES = ["GENERAL", "ICU", "PEDIATRIC", "VENTILATOR"]
// const BEDS_PER_HOSPITAL = {
//   GENERAL: Math.floor(Math.random() * 15) + 10, // 10-25 general beds
//   ICU: Math.floor(Math.random() * 10) + 5, // 5-15 ICU beds
//   PEDIATRIC: Math.floor(Math.random() * 8) + 3, // 3-11 pediatric beds
//   VENTILATOR: Math.floor(Math.random() * 5) + 2, // 2-7 ventilator beds
// }

// async function seedBedsForHospitals() {
//   try {
//     console.log("📊 Fetching all hospitals...")
//     const hospitals = await prisma.hospital.findMany()

//     if (hospitals.length === 0) {
//       console.log("❌ No hospitals found. Please run the hospital seed script first.")
//       process.exit(1)
//     }

//     console.log(`✅ Found ${hospitals.length} hospitals`)

//     let totalBedsCreated = 0

//     for (const hospital of hospitals) {
//       console.log(`\n🏥 Creating beds for: ${hospital.name}`)

//       const bedsToCreate = []
//       let bedCounter = 1

//       for (const bedType of BED_TYPES) {
//         const bedCount = Math.floor(Math.random() * 15) + 5 // 5-20 beds per type
//         for (let i = 0; i < bedCount; i++) {
//           bedsToCreate.push({
//             type: bedType,
//             bedNumber: `${bedType.charAt(0)}-${bedCounter.toString().padStart(3, "0")}`,
//             hospitalId: hospital.id,
//             status: ["AVAILABLE", "AVAILABLE", "AVAILABLE", "OCCUPIED", "MAINTENANCE"][Math.floor(Math.random() * 5)], // 60% available, 20% occupied, 20% maintenance
//           })
//           bedCounter++
//         }
//       }

//       try {
//         await prisma.bed.createMany({
//           data: bedsToCreate,
//           skipDuplicates: true,
//         })

//         const availableBeds = bedsToCreate.filter((b) => b.status === "AVAILABLE").length
//         console.log(`   ✅ Created ${bedsToCreate.length} beds (${availableBeds} available)`)
//         totalBedsCreated += bedsToCreate.length
//       } catch (error) {
//         console.log(`   ⚠️ Some beds may already exist for this hospital`)
//       }
//     }

//     console.log(`\n✅ Successfully created ${totalBedsCreated} total beds across all hospitals!`)
//   } catch (error) {
//     console.error("❌ Error seeding beds:", error)
//   } finally {
//     await prisma.$disconnect()
//   }
// }

// seedBedsForHospitals()
