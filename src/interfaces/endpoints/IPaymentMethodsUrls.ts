export interface IPaymentMethodsUrls{
    CREATE_PAYMENT_METHOD: string,
    GET_PAYMENT_METHODS: string,
    GET_PAYMENT_METHOD_BY_ID: (id: string) => string,
    UPDATE_PAYMENT_METHOD_BY_ID: (id: string) => string,
    DELETE_PAYMENT_METHOD_BY_ID: (id: string) => string,
}