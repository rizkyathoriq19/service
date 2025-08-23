import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '$utils/prisma.utils';
import Logger from '$pkg/logger';
import { ServiceResponse, INTERNAL_SERVER_ERROR_SERVICE_RESPONSE, INVALID_ID_SERVICE_RESPONSE } from '$entities/Service';
import { exclude, UserLoginDTO, UserRegisterDTO } from '$entities/User';

export async function register(params: UserRegisterDTO): Promise<ServiceResponse<any>> {
    try {
        const existingUser = await prisma.dealers.findUnique({
            where: { username: params.username }
        });

        if (existingUser) {
            return {
                status: false,
                data: {},
                err: { code: 400, message: 'Username sudah ada' },
            };
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(params.password, salt);

        const user = await prisma.dealers.create({
            data: {
                name: params.name,
                username: params.username,
                password: hashedPassword,
                address: params.address
            },
        });

        return {
            status: true,
            message: 'User berhasil ditambahkan',
            data: exclude(user, 'password'),
        };
    } catch (err) {
        Logger.error(`AuthService.register: ${err}`);
        return {
            status: false,
            data: {},
            err: {
                code: 400,
                message: 'Gagal membuat user',
            },
        };
    }
}

export async function login(params: UserLoginDTO): Promise<ServiceResponse<any>> {
    try {
        const user = await prisma.dealers.findUnique({ where: { username: params.username } });

        if (!user || !(await bcrypt.compare(params.password, user.password))) {
            return {
                status: false,
                data: {},
                err: {
                    code: 401,
                    message: 'username atau password tidak valid',
                },
            };
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
            expiresIn: '1d',
        });

        return {
            status: true,
            message:'Login berhasil',
            data: {
                token,
            },
        };
    } catch (err) {
        Logger.error(`AuthService.login: ${err}`);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}

export async function getProfile(dealerId: number): Promise<ServiceResponse<any>> {
    try {
        const dealer = await prisma.dealers.findUnique({ 
            where: { id: dealerId },
        });

        if (!dealer) {
            return INVALID_ID_SERVICE_RESPONSE;
        }

        return {
            status: true,
            message: 'Data dealer berhasil diambil',
            data: exclude(dealer, 'password'),
        }
    } catch (err) {
        Logger.error(`AuthService.getProfile: ${err}`);
        return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
    }
}