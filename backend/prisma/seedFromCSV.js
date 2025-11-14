const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Helper to generate random coordinates (roughly within India)
function getRandomCoords() {
  const lat = 8 + Math.random() * (37 - 8); // between 8°N and 37°N
  const lon = 68 + Math.random() * (97 - 68); // between 68°E and 97°E
  return { lat, lon };
}

// Helper to generate random phone xnumbers
function getRandomPhone() {
  return `+91${Math.floor(6000000000 + Math.random() * 3999999999)}`;
}

async function importHospitals() {
  const hospitals = [];
  const csvPath = path.join(__dirname, "../data/HospitalsInIndia.csv");

  console.log("📥 Reading CSV from:", csvPath);

  // Read and process the CSV file
  fs.createReadStream(csvPath)
    .pipe(csv({ mapHeaders: ({ header }) => header.trim() })) // trims header names
    .on("headers", (headers) => {
      console.log("🧾 Headers detected:", headers);
    })
    .on("data", (row) => {
      try {
        // Robust field handling with fallbacks for capitalization differences
        const name =
          row["Hospital"]?.trim() ||
          row["hospital"]?.trim() ||
          "Unknown Hospital";

        const city =
          row["City"]?.trim() ||
          row["city"]?.trim() ||
          "Unknown City";

        const state =
          row["State"]?.trim() ||
          row["state"]?.trim() ||
          "Unknown State";

        const address =
          row["LocalAddress"]?.trim() ||
          row["localaddress"]?.trim() ||
          "";

        const pincode =
          row["Pincode"]?.trim() ||
          row["pincode"]?.trim() ||
          "";

        const fullAddress = `${address}, ${city}, ${state} - ${pincode}`.replace(
          /, ,/g,
          ","
        );

        const { lat, lon } = getRandomCoords();

        hospitals.push({
          name,
          address: fullAddress,
          contactPhone: getRandomPhone(),
          latitude: lat,
          longitude: lon,
          city,
          state,
        });
      } catch (err) {
        console.error("⚠️ Error reading row:", err);
      }
    })
    .on("end", async () => {
      console.log(`📊 Preparing to insert ${hospitals.length} hospitals...`);

      try {
        await prisma.hospital.createMany({
          data: hospitals,
          skipDuplicates: true, // avoids crash if duplicates exist
        });

        console.log(`✅ Successfully inserted ${hospitals.length} hospitals!`);
      } catch (error) {
        console.error("❌ Error inserting into DB:", error);
      } finally {
        await prisma.$disconnect();
      }
    })
    .on("error", (err) => {
      console.error("❌ Error reading CSV file:", err);
    });
}

importHospitals();
