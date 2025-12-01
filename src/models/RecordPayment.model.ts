import type { MonthlyBill } from "./MonthlyBill.model";
import type { User } from "./User.model";

export interface RecordPayments {
  id: number;
  user: User,
  unitNumber: number | undefined,
  amount: string | undefined,
  payment_date: string,
  payment_method: string,
  reference_number: string | undefined,
  proof_of_payment: string | null,
  status: string,
  bill?: MonthlyBill,
  payment_type: string,
  advance_start_date?: string,
  advance_end_date?: string
}