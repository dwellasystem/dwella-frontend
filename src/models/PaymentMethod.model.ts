// models/PaymentMethod.model.ts
export interface PaymentMethod {
    id: number;
    name: string;
    account_name?: string;
    account_number?: string;
    instructions?: string;
    is_active: boolean;
}