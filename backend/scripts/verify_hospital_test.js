const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const hospitals = await prisma.hospital.findMany();
    console.log('Current Hospitals:', hospitals.map(h => ({ id: h.id, name: h.name, isVerified: h.isVerified })));

    if (hospitals.length > 0) {
        const target = hospitals[0];
        const newStatus = !target.isVerified;
        console.log(`Toggling hospital ${target.id} to ${newStatus}`);

        await prisma.hospital.update({
            where: { id: target.id },
            data: { isVerified: newStatus }
        });

        console.log('Update complete.');
    } else {
        console.log('No hospitals found.');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
