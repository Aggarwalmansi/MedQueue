const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const hospitals = await prisma.hospital.findMany({
        where: { isVerified: true },
        select: { id: true, name: true }
    });
    console.log('Verified Hospitals:', hospitals);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
