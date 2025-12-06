import type { Unit } from "./Unit.model";
import type { User } from "./User.model";

export interface MonthlyBill {
  id: number;
  user: User;
  unit: Unit;
  user_email: string;
  amount_due: string;
  due_date: string;
  payment_status: string;
  due_status: string;
  created_at: string;
  construction_bond: string;
}