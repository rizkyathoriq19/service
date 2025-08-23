import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {  Dealers } from '@prisma/client';
import { response_unauthorized } from '$utils/response.utils';
import { prisma } from '$utils/prisma.utils';

export interface RequestWithUser extends Request {
    user?: Dealers;
}

export const protect = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return response_unauthorized(res, 'Not authorized, no token');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
        
        const user = await prisma.dealers.findUnique({ where: { id: decoded.id } });

        if (!user) {
            return response_unauthorized(res, 'Not authorized, user not found');
        }
        
        req.user = user;
        next();
    } catch (error) {
        return response_unauthorized(res, 'Not authorized, token failed');
    }
};