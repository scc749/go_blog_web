export interface Model {
    id: number;
    created_at: Date;
    updated_at: Date;
}

export interface PageInfo {
    page: number;
    page_size: number;
}

export interface PageResult<T> {
    list: T[];
    total: number;
}

export interface Hit<T> {
    _id: string;
    _source: T;
}
