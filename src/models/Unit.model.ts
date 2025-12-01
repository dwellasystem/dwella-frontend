import type { BaseModel } from "./BaseModel";

export interface Unit extends BaseModel{
    id: number,
    unit_name: string,
    building: string,
    rent_amount: number,
    floor_area: number;
    isAvailable: boolean,
    bedrooms: number;
}