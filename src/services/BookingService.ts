import { prisma } from '$utils/prisma.utils';
import { ServiceResponse, INTERNAL_SERVER_ERROR_SERVICE_RESPONSE } from '$entities/Service';
import { BookingRequestDTO, UpdateBookingStatusDTO } from '$entities/Booking';
import Logger from '$pkg/logger';

export async function createBooking(params: BookingRequestDTO): Promise<ServiceResponse<any>> {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const schedule = await prisma.serviceSchedules.findUnique({
            where: {
                id: params.service_schedule_id
            }
        });

        if (!schedule) {
            return {
                status: false,
                data: {},
                err: {
                    code: 404,
                    message: 'Jadwal servis tidak ditemukan'
                }
            };
        }

        const selectedDate = new Date(schedule.schedule_date);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate <= today) {
            return {
                status: false,
                data: {},
                err: {
                    code: 400,
                    message: 'Pemesanan hanya bisa untuk H+1 (hari berikutnya)'
                }
            };
        }

        const scheduleWithQuota = await prisma.serviceSchedules.findFirst({
            where: {
                id: params.service_schedule_id,
                quota: { gt: 0 }
            }
        });

        if (!scheduleWithQuota) {
            return {
                status: false,
                data: {},
                err: {
                    code: 400,
                    message: 'Kuota jadwal servis sudah penuh'
                }
            };
        }

        const defaultStatus = await prisma.serviceStatuses.findFirst({
            where: { name: 'menunggu konfirmasi' }
        });

        if (!defaultStatus) {
            return {
                status: false,
                data: {},
                err: {
                    code: 500,
                    message: 'Status default tidak ditemukan'
                }
            };
        }

        const booking = await prisma.serviceBookings.create({
            data: {
                name: params.name,
                phone_no: params.phone_no,
                vehicle_type: params.vehicle_type,
                license_plate: params.license_plate,
                vehicle_problem: params.vehicle_problem,
                service_schedule_id: params.service_schedule_id,
                service_time: params.service_time,
                service_status_id: defaultStatus.id
            },
            include: {
                serviceSchedule: {
                    select: {
                        schedule_date: true,
                        quota: true
                    }
                },
                serviceStatus: {
                    select: {
                        name: true
                    }
                }
            }
        });

        await prisma.serviceSchedules.update({
            where: { id: params.service_schedule_id },
            data: { quota: { decrement: 1 } }
        });

        return {
            status: true,
            message: 'Pemesanan service berhasil dibuat',
            data: { 
                id: booking.id,
                name: booking.name,
                phone_no: booking.phone_no,
                vehicle_type: booking.vehicle_type,
                license_plate: booking.license_plate,
                vehicle_problem: booking.vehicle_problem,
                service_schedule_id: booking.service_schedule_id,
                service_time: booking.service_time,
                status: booking.serviceStatus.name,
                schedule_date: booking.serviceSchedule.schedule_date,
                created_at: booking.created_at
            }
        };

    } catch (err: any) {
        Logger.error(`BookingService.createBooking: ${err}`);
        if (err.code === 'P2002') {
            return {
                status: false,
                data: {},
                err: {
                    code: 400,
                    message: 'Booking sudah ada untuk jadwal ini'
                }
            };
        }
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}

export async function getBookings(): Promise<ServiceResponse<any>> {
    try {
        const bookings = await prisma.serviceBookings.findMany({
            include: {
                serviceSchedule: {
                    select: {
                        schedule_date: true,
                        quota: true
                    }
                },
                serviceStatus: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        const formattedBookings = bookings.map(booking => ({
            id: booking.id,
            name: booking.name,
            phone_no: booking.phone_no,
            vehicle_type: booking.vehicle_type,
            license_plate: booking.license_plate,
            vehicle_problem: booking.vehicle_problem,
            service_schedule_id: booking.service_schedule_id,
            service_time: booking.service_time,
            status: booking.serviceStatus.name,
            schedule_date: booking.serviceSchedule.schedule_date,
            created_at: booking.created_at,
            updated_at: booking.updated_at
        }));

        return {
            status: true,
            message: 'Data booking berhasil diambil',
            data: formattedBookings
        };
    } catch (err) {
        Logger.error(`BookingService.getAllBookings: ${err}`);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}

export async function getBookingById(id: number): Promise<ServiceResponse<any>> {
    try {
        const booking = await prisma.serviceBookings.findUnique({
            where: { id },
            include: {
                serviceSchedule: {
                    select: {
                        schedule_date: true,
                        quota: true,
                        dealer: {
                            select: {
                                name: true,
                                address: true
                            }
                        }
                    }
                },
                serviceStatus: {
                    select: {
                        name: true
                    }
                }
            }
        });

        if (!booking) {
            return {
                status: false,
                data: {},
                err: {
                    code: 404,
                    message: 'Data booking tidak ditemukan'
                }
            };
        }

        const formattedBooking = {
            id: booking.id,
            name: booking.name,
            phone_no: booking.phone_no,
            vehicle_type: booking.vehicle_type,
            license_plate: booking.license_plate,
            vehicle_problem: booking.vehicle_problem,
            service_schedule_id: booking.service_schedule_id,
            service_time: booking.service_time,
            status: booking.serviceStatus.name,
            schedule_date: booking.serviceSchedule.schedule_date,
            dealer_name: booking.serviceSchedule.dealer.name,
            dealer_address: booking.serviceSchedule.dealer.address,
            created_at: booking.created_at,
            updated_at: booking.updated_at
        };

        return {
            status: true,
            message: 'Data booking berhasil diambil',
            data: formattedBooking
        };
    } catch (err) {
        Logger.error(`BookingService.getBookingById: ${err}`);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}

export async function updateBookingStatus(id: number, params: UpdateBookingStatusDTO): Promise<ServiceResponse<any>> {
    try {
        const status = await prisma.serviceStatuses.findFirst({
            where: { name: params.status }
        });

        if (!status) {
            return {
                status: false,
                data: {},
                err: {
                    code: 400,
                    message: 'Status tidak valid'
                }
            };
        }

        const oldBooking = await prisma.serviceBookings.findUnique({
            where: { id },
            include: {
                serviceSchedule: true
            }
        });

        if (!oldBooking) {
            return {
                status: false,
                data: {},
                err: {
                    code: 404,
                    message: 'Data booking tidak ditemukan'
                }
            };
        }

        const booking = await prisma.serviceBookings.update({
            where: { id },
            data: { 
                service_status_id: status.id,
                updated_at: new Date()
            },
            include: {
                serviceStatus: {
                    select: {
                        name: true
                    }
                }
            }
        });

        if (params.status === 'konfirmasi batal') {
            await prisma.serviceSchedules.update({
                where: { id: oldBooking.service_schedule_id },
                data: { quota: { increment: 1 } }
            });
        }

        const oldStatus = await prisma.serviceStatuses.findUnique({
            where: { id: oldBooking.service_status_id }
        });

        if (oldStatus?.name === 'konfirmasi batal' && params.status !== 'konfirmasi batal') {
            await prisma.serviceSchedules.update({
                where: { id: oldBooking.service_schedule_id },
                data: { quota: { decrement: 1 } }
            });
        }

        const responseData = {
            id: booking.id,
            status: booking.serviceStatus.name,
            updated_at: booking.updated_at
        };

        return {
            status: true,
            message: 'Status booking berhasil diubah',
            data: responseData
        };
    } catch (err) {
        Logger.error(`BookingService.updateBookingStatus: ${err}`);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}

export async function deleteBooking(id: number): Promise<ServiceResponse<any>> { 
    try {
        const booking = await prisma.serviceBookings.delete({ where: { id } });

        if (!booking) {
            return {
                status: false,
                data: {},
                err: {
                    code: 404,
                    message: 'Data booking tidak ditemukan'
                }
            };
        }

        return {
            status: true,
            message: 'Data booking berhasil dihapus',
            data: {}
        };
    } catch (err) {
        Logger.error(`BookingService.deleteBooking: ${err}`);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}