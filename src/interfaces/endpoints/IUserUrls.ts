export interface IUserUrls{
    GET_USERS: string
    CREATE_USER: string,
    GET_USER_BY_ID: (id:number | string) => string,
    UPDATE_USER_BY_ID: (id: number | string) => string,
    DELETE_USER_BY_ID: (id: number | string) => string
}