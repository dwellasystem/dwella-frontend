import type { BaseModel } from "./BaseModel";
import type { Unit } from "./Unit.model";
import type { User } from "./User.model";

export interface PaginatedAssignedUnit extends BaseModel {
    id?: number;
    unit_id?: Unit;
    assigned_by?: User;
    building: string;
    move_in_date: string;
    security: boolean;
    maintenance: boolean;
    amenities: boolean;
    unit_status: string;
}