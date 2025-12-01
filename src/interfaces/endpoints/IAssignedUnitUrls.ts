export interface IAssignedUnitUrls{
    GET_ASSIGNED_UNITS: string
    CREATE_ASSIGNED_UNIT: string,
    GET_ASSIGNED_UNIT_BY_ID: (id:number | string) => string,
    UPDATE_ASSIGNED_UNIT_BY_ID: (id: number | string) => string,
    DELETE_ASSIGNED_UNIT_BY_ID: (id: number | string) => string
}