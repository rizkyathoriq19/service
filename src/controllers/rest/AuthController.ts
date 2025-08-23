import { Request, Response } from 'express';
import { response_bad_request, response_created, response_success, response_unauthorized } from '$utils/response.utils';
import * as AuthService from '$services/AuthService';

export const register = async (req: Request, res: Response) => {
    const { name, username, password, address } = req.body;

    if (!name || !username || !password || !address) {
        return response_bad_request(res, 'Please provide name, username, password, and address');
    }

    const result = await AuthService.register({ name, username, password, address });

    if (!result.status) {
        return response_bad_request(res, result.err?.message || 'Failed to create user');
    }

    return response_created(res, result.data, result.data.message);
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const result = await AuthService.login({ username, password });

    if (!result.status) {
        return response_unauthorized(res, result.err?.message || 'Invalid username or password');
    }

    return response_success(res, result.data, result.message)
};