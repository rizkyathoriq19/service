import { PrismaClient } from '@prisma/client';

export async function seedServiceStatuses(prisma: PrismaClient) {
    const statuses = [
        { name: "Pending" },
        { name: "Confirmed" },
        { name: "Completed" },
        { name: "Cancelled" },
    ];

    for (const status of statuses) {
        await prisma.serviceStatuses.create({
            data: status,
        });
    }

    console.log("ServiceStatuses successfully seeded");
}
