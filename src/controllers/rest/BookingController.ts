import { Request, Response } from 'express';
import * as BookingService from '$services/BookingService';
import { BookingRequestDTO, UpdateBookingStatusDTO } from '$entities/Booking';
import { ErrorStructure, generateErrorStructure } from '$validations/helper';
import { response_bad_request, response_created, response_not_found, response_success } from '$utils/response.utils';

export const createBooking = async (req: Request, res: Response) => {
    const bookingReq: BookingRequestDTO = req.body;
    const errors: ErrorStructure[] = [];

    if (!bookingReq.name) errors.push(generateErrorStructure('name', 'Nama harus diisi'));
    if (!bookingReq.phone_no) errors.push(generateErrorStructure('phone_no', 'Nomor telepon harus diisi'));
    if (!bookingReq.vehicle_type) errors.push(generateErrorStructure('vehicle_type', 'Jenis kendaraan harus diisi'));
    if (!bookingReq.license_plate) errors.push(generateErrorStructure('license_plate', 'Plat nomor harus diisi'));
    if (!bookingReq.vehicle_problem) errors.push(generateErrorStructure('vehicle_problem', 'Keluhan kendaraan harus diisi'));
    if (!bookingReq.service_schedule_id) errors.push(generateErrorStructure('service_schedule_id', 'Jadwal servis harus dipilih'));
    if (!bookingReq.service_time) errors.push(generateErrorStructure('service_time', 'Waktu servis harus diisi'));

    if (errors.length > 0) {
        return response_bad_request(res, 'Validasi gagal', errors);
    }
    
    const bookingData: BookingRequestDTO = {
        name: bookingReq.name.trim(),
        phone_no: bookingReq.phone_no.trim(),
        vehicle_type: bookingReq.vehicle_type.trim(),
        license_plate: bookingReq.license_plate.trim(),
        vehicle_problem: bookingReq.vehicle_problem.trim(),
        service_schedule_id: bookingReq.service_schedule_id,
        service_time: bookingReq.service_time.trim()
    };

    const result = await BookingService.createBooking(bookingData);

    if(!result.status) return response_bad_request(res, result.err?.message || 'Gagal membuat booking');

    return response_created(res, result.data, result.data.message);
}

export const getAllBookings = async (req: Request, res: Response) => {
        const { page, limit, license_plate } = req.query as { page: string; limit: string, license_plate?: string };
        const result = await BookingService.getBookings(Number(page) || 1, Number(limit) || 10, license_plate);
        
        if (!result.status) {
            return response_bad_request(res, result.err?.message || 'Gagal mengambil bookings');
        }

        return response_success(res, result.data, result.message, result.meta);
};

export const getBookingById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
        return response_bad_request(res, 'ID booking harus berupa number');
    }

    const result = await BookingService.getBookingById(id);
    
    if (!result.status) {
        if (result.err?.code === 404) {
            return response_not_found(res, result.err.message);
        }
        return response_bad_request(res, result.err?.message || 'Gagal mengambil booking');
    }

    return response_success(res, result.data, result.message);
};

export const updateBookingStatus = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
        return response_bad_request(res, 'ID booking harus berupa number');
    }

    const statusData: UpdateBookingStatusDTO = req.body;
    
    const validStatuses = ['menunggu konfirmasi', 'konfirmasi batal', 'konfirmasi datang', 'tidak datang', 'datang'];
    if (!validStatuses.includes(statusData.status)) {
        return response_bad_request(res, 'Status tidak valid');
    }

    const result = await BookingService.updateBookingStatus(id, statusData);
    
    if (!result.status) {
        if (result.err?.code === 404) {
            return response_not_found(res, result.err.message);
        }
        return response_bad_request(res, result.err?.message || 'Gagal update status booking');
    }

    return response_success(res, result.data, result.message);
};

export const deleteBooking = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
        return response_bad_request(res, 'ID booking harus berupa number');
    }

    const result = await BookingService.deleteBooking(id);
    
    if (!result.status) {
        if (result.err?.code === 404) {
            return response_not_found(res, result.err.message);
        }
        return response_bad_request(res, result.err?.message || 'Gagal menghapus booking');
    }

    return response_success(res, result.data, result.message);
};