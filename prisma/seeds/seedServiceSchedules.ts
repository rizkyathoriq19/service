import { PrismaClient } from '@prisma/client';

export async function seedServiceSchedules(prisma: PrismaClient) {
    const dealers = await prisma.dealers.findMany();

    if (dealers.length === 0) {
        console.log("No dealers found. Please seed dealers first.");
        return;
    }

    const schedulesData: { schedule_date: Date; quota: number; dealer_id: number }[] = [];

    for (const dealer of dealers) {
        for (let i = 1; i <= 5; i++) {
            schedulesData.push({
                schedule_date: new Date(2025, 7, i),
                quota: 10 + i,                        
                dealer_id: dealer.id,
            });
        }
    }

    for (const schedule of schedulesData) {
        await prisma.serviceSchedules.create({
            data: schedule,
        });
    }

    console.log("ServiceSchedules successfully seeded");
}
