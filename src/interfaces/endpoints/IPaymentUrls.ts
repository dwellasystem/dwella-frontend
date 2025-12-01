export interface IPaymentUrls{
    CREATE_PAYMENT: string,
    GET_PAYMENTS: string,
    GET_PAYMENT_BY_ID: (id: string) => string,
    UPDATE_PAYMENT_BY_ID: (id: string) => string,
    DELETE_PAYMENT_BY_ID: (id: string) => string,
    PENDING_PAYMENTS: string
}