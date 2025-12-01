export interface IInquiriesUrls{
    GET_INQUIRIES: string,
    CREATE_INQUIRY: string,
    GET_INQUIRY_BY_ID: (id: number) => string,
    UPDATE_INQUIRY_BY_ID: (id: number) => string,
    DELETE_INQUIRY_BY_ID: (id: number) => string,
    OPEN_INQUIRIES: string
}