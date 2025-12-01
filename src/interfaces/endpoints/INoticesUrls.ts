export interface INoticesUrls{
    GET_NOTICES: string,
    CREATE_NOTICE: string,
    GET_NOTICE_BY_ID: (id: number) => string,
    UPDATE_NOTICE_BY_ID: (id: number) => string,
    DELETE_NOTICE_BY_ID: (id: number) => string,
}