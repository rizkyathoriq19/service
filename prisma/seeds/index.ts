import { seedDealers } from "./seedDealer"
import { seedServiceSchedules } from "./seedServiceSchedules"
import { seedServiceStatuses } from "./seedServiceStatuses"
import { seedServiceBookings } from "./seedServiceBookings"
import { prisma } from "../../src/utils/prisma.utils"

async function seed(){
    // Seed Function Call Goes Here
    await seedDealers(prisma)
    await seedServiceSchedules(prisma)
    await seedServiceStatuses(prisma)
    await seedServiceBookings(prisma)
}

seed().then(()=>{
    console.log("ALL SEEDING DONE")
})