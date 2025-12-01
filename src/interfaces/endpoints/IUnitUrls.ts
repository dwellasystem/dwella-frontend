export interface IUnitUrls{
    GET_UNITS: string
    CREATE_UNIT: string,
    GET_UNIT_BY_ID: (id:number | string) => string,
    UPDATE_UNIT_BY_ID: (id: number | string) => string,
    DELETE_UNIT_BY_ID: (id: number | string) => string
}