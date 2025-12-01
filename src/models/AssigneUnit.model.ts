import type { BaseModel } from "./BaseModel";
import type { Unit } from "./Unit.model";
import type { User } from "./User.model";

export interface AssignedUnit extends BaseModel {
    id?: number;
    unit_id?: number;
    assigned_by?: number;
    building: string;
    security: boolean;
    maintenance: boolean;
    amenities: boolean;
    unit_status: string;
}

export interface AssignedUnitPopulated {
  id?: number;
  unit_id: Unit;
  assigned_by: User;
  building: string;
  security: boolean;
  maintenance: boolean;
  amenities: boolean;
  unit_status: string;
}