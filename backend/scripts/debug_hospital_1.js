const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const id = 1;
        console.log(`Fetching hospital ${id}...`);

        const hospital = await prisma.hospital.findUnique({
            where: { id: parseInt(id) },
            include: {
                manager: {
                    select: {
                        email: true,
                        phone: true
                    }
                },
                ratings: true
            }
        });

        if (!hospital) {
            console.log('Hospital not found');
            return;
        }

        console.log('Hospital Data:', JSON.stringify(hospital, null, 2));

        // Check specific fields that might cause breakage
        console.log('Accreditations type:', typeof hospital.accreditations);
        console.log('Accreditations value:', hospital.accreditations);

        console.log('Specializations type:', typeof hospital.specializations);
        console.log('Specializations value:', hospital.specializations);

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
