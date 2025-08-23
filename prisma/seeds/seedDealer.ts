import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

export async function seedDealers(prisma: PrismaClient) {
    const dealersData = [
        {
            name: "John Doe",
            username: "johndoe",
            address: "Jl. Sudirman No.1",
        },
        {
            name: "Jane Smith",
            username: "janesmith",
            address: "Jl. Thamrin No.5",
        },
        {
            name: "Alice Johnson",
            username: "alicej",
            address: "Jl. Gatot Subroto No.10",
        },
        {
            name: "Bob Williams",
            username: "bobw",
            address: "Jl. Merdeka No.20",
        },
        {
            name: "Charlie Brown",
            username: "charlieb",
            address: "Jl. Pahlawan No.15",
        },
    ];

    for (const dealer of dealersData) {
        const hashedPassword = await bcrypt.hash("password", 12);

        await prisma.dealers.create({
            data: {
                ...dealer,
                password: hashedPassword,
            },
        });
    }

    console.log("5 dealers successfully seeded");
}
