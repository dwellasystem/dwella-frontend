import type { BaseModel } from "./BaseModel";
import type { Unit } from "./Unit.model";
import type { User } from "./User.model";

export interface Inquiry extends BaseModel{
    id: number;
    unit: Unit;
    title: string;
    description: string;
    status: string;
    resident: User;
    type: string
}