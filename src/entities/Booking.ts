export interface BookingRequestDTO {
    name: string;
    phone_no: string;
    vehicle_type: string;
    license_plate: string;
    vehicle_problem: string;
    service_schedule_id: number;
    service_time: string;
}

export interface BookingResponseDTO {
    id: number;
    name: string;
    phone_no: string;
    vehicle_type: string;
    license_plate: string;
    vehicle_problem: string;
    service_schedule_id: number;
    service_time: string;
    status: string;
    schedule_date: Date;
    created_at: Date;
}

export interface UpdateBookingStatusDTO {
    status: 'menunggu konfirmasi' | 'konfirmasi batal' | 'konfirmasi datang' | 'tidak datang' | 'datang';
}

export function exclude<Entity, Key extends keyof Entity>(
    entity: Entity,
    ...keys: Key[]
): Omit<Entity, Key> {
    const result = { ...entity };
    for (const key of keys) {
        delete result[key];
    }
    return result;
}