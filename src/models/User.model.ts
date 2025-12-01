import type { BaseModel } from "./BaseModel";

export interface User extends BaseModel{
  id?: number;
  username?: string;
  password?:string;
  email?: string;
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  profile?: string | null;
  is_staff?: boolean;
  move_in_date?: string;
  account_status?: 'inactive' | 'active'; // update with all possible statuses
  // created_at?: string; // ISO string format
  phone_number?: string;
  address?: string;
  role?:string;
  unit?: number | string; // Assuming unit is represented by its ID
  unit_name?: string; // Added unit_name to represent the name of the unit
}