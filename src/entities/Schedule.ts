export interface ScheduleRequestDTO {
    date?: string;
}

export interface CreateScheduleDTO {
    schedule_date: string;
    quota: number;
}

export interface UpdateScheduleDTO {
    schedule_date?: string;
    quota?: number;
}

export interface ScheduleResponseDTO {
    id: number;
    schedule_date: Date;
    quota: number;
    used_quota?: number;
    available_quota?: number;
    dealer_name: string;
    dealer_address: string;
    booking_count?: number;
    created_at: Date;
    updated_at: Date;
}