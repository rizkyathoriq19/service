import { prisma } from '$utils/prisma.utils';
import { ServiceResponse, INTERNAL_SERVER_ERROR_SERVICE_RESPONSE } from '$entities/Service';
import { CreateScheduleDTO, ScheduleRequestDTO, UpdateScheduleDTO } from '$entities/Schedule';
import Logger from '$pkg/logger';

export async function getAvailableSchedules(params?: ScheduleRequestDTO): Promise<ServiceResponse<any>> {
    try {
        const whereClause: any = {
            quota: { gt: 0 },
            schedule_date: { gte: new Date() }
        };

        if (params?.date) {
            const selectedDate = new Date(params.date);
            if (isNaN(selectedDate.getTime())) {
                return {
                    status: false,
                    data: {},
                    err: {
                        code: 400,
                        message: 'Format tanggal tidak valid. Gunakan format YYYY-MM-DD'
                    }
                };
            }
            selectedDate.setHours(0, 0, 0, 0);
            const nextDay = new Date(selectedDate);
            nextDay.setDate(selectedDate.getDate() + 1);
            
            whereClause.schedule_date = {
                gte: selectedDate,
                lt: nextDay
            };
        }

        const schedules = await prisma.serviceSchedules.findMany({
            where: whereClause,
            orderBy: [
                { schedule_date: 'asc' },
                { quota: 'asc' }
            ],
            select: {
                id: true,
                schedule_date: true,
                quota: true,
                dealer: {
                    select: {
                        name: true,
                        address: true
                    }
                }
            }
        });

        const formattedSchedules = schedules.map(schedule => ({
            id: schedule.id,
            schedule_date: schedule.schedule_date,
            quota: schedule.quota,
            dealer_name: schedule.dealer.name,
            dealer_address: schedule.dealer.address
        }));

        return {
            status: true,
            message: 'Jadwal yang tersedia berhasil diambil',
            data: formattedSchedules
        };
    } catch (err) {
        Logger.error(`SchedulesService.getAvailableSchedules: ${err}`);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}

export async function createSchedule(params: CreateScheduleDTO, dealerId: number): Promise<ServiceResponse<any>> {
    try {
        const scheduleDate = new Date(params.schedule_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (scheduleDate < today) {
            return {
                status: false,
                data: {},
                err: {
                    code: 400,
                    message: 'Tanggal jadwal tidak boleh lebih kecil dari hari ini'
                }
            };
        }

        const existingSchedule = await prisma.serviceSchedules.findFirst({
            where: {
                schedule_date: scheduleDate,
                dealer_id: dealerId
            }
        });

        if (existingSchedule) {
            return {
                status: false,
                data: {},
                err: {
                    code: 400,
                    message: 'Jadwal sudah ada untuk tanggal ini'
                }
            };
        }

        const schedule = await prisma.serviceSchedules.create({
            data: {
                schedule_date: scheduleDate,
                quota: params.quota,
                dealer_id: dealerId
            },
            include: {
                dealer: {
                    select: {
                        name: true,
                        address: true
                    }
                }
            }
        });

        const formattedSchedule = {
            id: schedule.id,
            schedule_date: schedule.schedule_date,
            quota: schedule.quota,
            dealer_name: schedule.dealer.name,
            dealer_address: schedule.dealer.address,
            created_at: schedule.created_at
        };

        return {
            status: true,
            message: 'Jadwal berhasil dibuat',
            data: formattedSchedule
        };

    } catch (err) {
        Logger.error(`SchedulesService.createSchedule: ${err}`);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}

export async function updateSchedule(id: number, params: UpdateScheduleDTO): Promise<ServiceResponse<any>> {
    try {
        const schedule = await prisma.serviceSchedules.findUnique({
            where: { id }
        });

        if (!schedule) {
            return {
                status: false,
                data: {},
                err: {
                    code: 404,
                    message: 'Jadwal tidak ditemukan'
                }
            };
        }

        if (params.schedule_date) {
            const scheduleDate = new Date(params.schedule_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (scheduleDate < today) {
                return {
                    status: false,
                    data: {},
                    err: {
                        code: 400,
                        message: 'Tanggal jadwal tidak boleh lebih kecil dari hari ini'
                    }
                };
            }
        }

        const updatedSchedule = await prisma.serviceSchedules.update({
            where: { id },
            data: {
                ...(params.schedule_date && { schedule_date: new Date(params.schedule_date) }),
                ...(params.quota && { quota: params.quota })
            },
            include: {
                dealer: {
                    select: {
                        name: true,
                        address: true
                    }
                }
            }
        });

        const formattedSchedule = {
            id: updatedSchedule.id,
            schedule_date: updatedSchedule.schedule_date,
            quota: updatedSchedule.quota,
            dealer_name: updatedSchedule.dealer.name,
            dealer_address: updatedSchedule.dealer.address,
            updated_at: updatedSchedule.updated_at
        };

        return {
            status: true,
            message: 'Jadwal berhasil diupdate',
            data: formattedSchedule
        };

    } catch (err) {
        Logger.error(`SchedulesService.updateSchedule: ${err}`);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}

export async function deleteSchedule(id: number): Promise<ServiceResponse<any>> {
    try {
        const schedule = await prisma.serviceSchedules.findUnique({
            where: { id },
            include: {
                serviceBookings: true
            }
        });

        if (!schedule) {
            return {
                status: false,
                data: {},
                err: {
                    code: 404,
                    message: 'Jadwal tidak ditemukan'
                }
            };
        }

        if (schedule.serviceBookings.length > 0) {
            return {
                status: false,
                data: {},
                err: {
                    code: 400,
                    message: 'Tidak dapat menghapus jadwal yang sudah memiliki booking'
                }
            };
        }

        await prisma.serviceSchedules.delete({
            where: { id }
        });

        return {
            status: true,
            message: 'Jadwal berhasil dihapus',
            data: {}
        };

    } catch (err) {
        Logger.error(`SchedulesService.deleteSchedule: ${err}`);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}

export async function getAllSchedules(dealerId: number): Promise<ServiceResponse<any>> {
    try {
        if (!dealerId) {
            return {
                status: false,
                data: {},
                err: {
                    code: 401,
                    message: 'Dealer tidak terautentikasi'
                }
            };
        }

        const schedules = await prisma.serviceSchedules.findMany({
            where: {
                dealer_id: dealerId
            },
            orderBy: [
                { schedule_date: 'asc' }
            ],
            include: {
                dealer: {
                    select: {
                        name: true,
                        address: true
                    }
                },
                serviceBookings: {
                    select: {
                        id: true,
                        service_status_id: true
                    }
                }
            }
        });

        const formattedSchedules = schedules.map(schedule => ({
            id: schedule.id,
            schedule_date: schedule.schedule_date,
            quota: schedule.quota,
            used_quota: schedule.serviceBookings.length,
            available_quota: schedule.quota - schedule.serviceBookings.length,
            dealer_name: schedule.dealer.name,
            dealer_address: schedule.dealer.address,
            booking_count: schedule.serviceBookings.length,
            created_at: schedule.created_at,
            updated_at: schedule.updated_at
        }));

        return {
            status: true,
            message: 'Jadwal dealer berhasil diambil',
            data: formattedSchedules
        };

    } catch (err) {
        Logger.error(`SchedulesService.getAllSchedules: ${err}`);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}

export async function getScheduleById(id: number, dealerId: number): Promise<ServiceResponse<any>> {
    try {
        if (!dealerId) {
            return {
                status: false,
                data: {},
                err: {
                    code: 401,
                    message: 'Dealer tidak terautentikasi'
                }
            };
        }

        const schedule = await prisma.serviceSchedules.findFirst({
            where: { 
                id,
                dealer_id: dealerId
            },
            include: {
                dealer: { select: { name: true, address: true } },
                serviceBookings: { 
                    include: {
                        serviceStatus: { select: { name: true } }
                    }
                }
            }
        });

        if (!schedule) {
            return { 
                status: false, 
                data: {}, 
                err: { code: 404, message: 'Jadwal tidak ditemukan atau bukan milik dealer ini' } 
            };
        }

        const formattedSchedule = {
            id: schedule.id,
            schedule_date: schedule.schedule_date,
            quota: schedule.quota,
            used_quota: schedule.serviceBookings.length,
            available_quota: schedule.quota - schedule.serviceBookings.length,
            dealer_name: schedule.dealer.name,
            dealer_address: schedule.dealer.address,
            bookings: schedule.serviceBookings.map(booking => ({
                id: booking.id,
                status: booking.serviceStatus.name
            })),
            created_at: schedule.created_at,
            updated_at: schedule.updated_at
        };

        return {
            status: true,
            message: 'Jadwal berhasil diambil',
            data: formattedSchedule
        };
    } catch (err) {
        Logger.error(`SchedulesService.getScheduleById: ${err}`);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}
