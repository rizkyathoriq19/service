import { Request, Response } from 'express';
import * as ScheduleService from '$services/ScheduleService';
import { response_bad_request, response_created, response_not_found, response_success, response_unauthorized } from '$utils/response.utils';
import { CreateScheduleDTO, UpdateScheduleDTO } from '$entities/Schedule';
import { RequestWithUser } from '$middlewares/authMiddleware';

export const getAvailableSchedules = async (req: Request, res: Response) => {
    const { date } = req.query;
    const result = await ScheduleService.getAvailableSchedules({ date: date as string });

    if (!result.status) {
        return response_bad_request(res, result.err?.message || 'Gagal mengambil jadwal');
    }

    return response_success(res, result.data, result.message);
};

export const createSchedule = async (req: RequestWithUser, res: Response) => {
    const dealerId = req.user?.id
    if (!dealerId) return response_unauthorized(res, 'Dealer tidak terautentikasi');

    const { schedule_date, quota } = req.body;

    if (!schedule_date || !quota) {
        return response_bad_request(res, 'jadwal dan quota harus diisi');
    }

    if (typeof quota !== 'number' || quota <= 0) {
        return response_bad_request(res, 'quota harus berupa angka dan lebih besar dari 0');
    }

    const scheduleData: CreateScheduleDTO = {
        schedule_date,
        quota
    };

    const result = await ScheduleService.createSchedule(scheduleData, dealerId);

    if (!result.status) {
        return response_bad_request(res, result.err?.message);
    }

    return response_created(res, result.data, result.message);
};

export const updateSchedule = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { schedule_date, quota } = req.body;

    if (isNaN(id)) {
        return response_bad_request(res, 'ID jadwal harus berupa angka');
    }

    const scheduleData: UpdateScheduleDTO = {};
    
    if (schedule_date) scheduleData.schedule_date = schedule_date;
    if (quota !== undefined) {
        if (typeof quota !== 'number' || quota < 0) {
            return response_bad_request(res, 'quota harus berupa angka dan tidak negatif');
        }
        scheduleData.quota = quota;
    }

    const result = await ScheduleService.updateSchedule(id, scheduleData);

    if (!result.status) {
        if (result.err?.code === 404) {
            return response_not_found(res, result.err.message);
        }
        return response_bad_request(res, result.err?.message);
    }

    return response_success(res, result.data, result.message);
};

export const deleteSchedule = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        return response_bad_request(res, 'ID jadwal harus berupa angka');
    }

    const result = await ScheduleService.deleteSchedule(id);

    if (!result.status) {
        if (result.err?.code === 404) {
            return response_not_found(res, result.err.message);
        }
        return response_bad_request(res, result.err?.message);
    }

    return response_success(res, result.data, result.message);
};

export const getAllSchedules = async (req: RequestWithUser, res: Response) => {
    const dealerId = req.user?.id;
    if (!dealerId) return response_unauthorized(res, 'Dealer tidak terautentikasi');

    const result = await ScheduleService.getAllSchedules(dealerId);
    if (!result.status) {
        return response_bad_request(res, result.err?.message);
    }

    return response_success(res, result.data, result.message);
};

export const getScheduleById = async (req: RequestWithUser, res: Response) => {
    const dealerId = req.user?.id; 
    if (!dealerId) return response_unauthorized(res, 'Dealer tidak terautentikasi');

    const scheduleId = Number(req.params.id);

    const result = await ScheduleService.getScheduleById(scheduleId, dealerId);

    if (!result.status) {
        return response_bad_request(res, result.err?.message || 'Gagal mengambil jadwal');
    }

    return response_success(res, result.data, result.message);
};
