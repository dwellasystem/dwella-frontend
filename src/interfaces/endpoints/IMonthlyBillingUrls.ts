export interface IMonthlyBillingUrls{
    GET_BILL: string
    CREATE_BILL: string,
    GET_BILL_BY_ID: (id:number | string) => string,
    UPDATE_BILL_BY_ID: (id: number | string) => string,
    DELETE_BILL_BY_ID: (id: number | string) => string
}