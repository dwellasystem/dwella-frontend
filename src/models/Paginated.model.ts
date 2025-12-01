export interface Paginated<T>{
    count: number,
    next: string | undefined,
    previous: string | undefined,
    results: T[]
}