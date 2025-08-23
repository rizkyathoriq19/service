import { PrismaClient } from '@prisma/client';

interface ServiceBookingData {
    name: string;
    phone_no: string;
    vehicle_type: string;
    license_plate: string;
    vehicle_problem: string;
    service_schedule_id: number;
    service_time: string;
    service_status_id: number;
}

export async function seedServiceBookings(prisma: PrismaClient) {
    const schedules = await prisma.serviceSchedules.findMany();
    const statuses = await prisma.serviceStatuses.findMany();

    if (schedules.length === 0 || statuses.length === 0) {
        console.log("Please seed ServiceSchedules and ServiceStatuses first.");
        return;
    }

    const bookingsData: ServiceBookingData[] = [];

    for (const schedule of schedules) {
        for (let i = 1; i <= 3; i++) {
            bookingsData.push({
                name: `Customer ${i} for Dealer ${schedule.dealer_id}`,
                phone_no: `0812345678${i}`,
                vehicle_type: "Sedan",
                license_plate: `B1234${i}XYZ`,
                vehicle_problem: "Engine check",
                service_schedule_id: schedule.id,
                service_time: `${9 + i}:00 - ${10 + i}:00`,
                service_status_id: statuses[i % statuses.length].id,
            });
        }
    }

    for (const booking of bookingsData) {
        await prisma.serviceBookings.create({
            data: booking,
        });
    }

    console.log("ServiceBookings successfully seeded");
}
