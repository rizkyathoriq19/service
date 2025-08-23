import { PrismaClient } from '@prisma/client';

export async function seedServiceStatuses(prisma: PrismaClient) {
    const statuses = [
        { name: "menunggu konfirmasi" },
        { name: "konfirmasi batal" },
        { name: "konfirmasi datang" },
        { name: "tidak datang" },
        { name: "datang" },
    ];

    for (const status of statuses) {
        await prisma.serviceStatuses.create({
            data: status,
        });
    }

    console.log("ServiceStatuses successfully seeded");
}
