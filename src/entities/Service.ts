export interface ServiceResponse<T> {
    status: boolean;
    data?: T;
    err?: ServiceError;
    meta?: {
        page: number;
        perPage: number;
        totalPages: number;
        totalRows: number;
    };
}

interface ServiceError {
    message: string;
    code: number;
}

export const INTERNAL_SERVER_ERROR_SERVICE_RESPONSE: ServiceResponse<{}> = {
    status: false,
    data: {},
    err: {
        message: "Internal Server Error",
        code: 500
    }
}

export const INVALID_ID_SERVICE_RESPONSE: ServiceResponse<{}> = {
    status: false,
    data: {},
    err: {
        message: "Invalid ID, Data not Found",
        code: 404
    }
}

export function BadRequestWithMessage(message: string): ServiceResponse<{}> {
    return {
        status: false,
        data: {},
        err: {
            message,
            code: 400
        }
    }
}