import type {Model, PageInfo, PageResult} from "@/api/common";
import type {ApiResponse} from "@/utils/request";
import service from "@/utils/request";

export interface Advertisement extends Model {
    ad_image: string;
    link: string;
    title: string;
    content: string;
}

export interface AdvertisementInfoResponse {
    list: Advertisement[];
    total: number;
}

export const advertisementInfo = (): Promise<ApiResponse<AdvertisementInfoResponse>> => {
    return service({
        url: '/advertisement/info',
        method: 'get',
    })
}

export interface AdvertisementCreateRequest {
    ad_image: string;
    link: string;
    title: string;
    content: string;
}

export const advertisementCreate = (data: AdvertisementCreateRequest): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/advertisement/create',
        method: 'post',
        data: data
    });
}

export interface AdvertisementDeleteRequest {
    ids: number[];
}

export const advertisementDelete = (data: AdvertisementDeleteRequest): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/advertisement/delete',
        method: 'delete',
        data: data
    });
}

export interface AdvertisementUpdateRequest {
    id: number;
    link: string;
    title: string;
    content: string;
}

export const advertisementUpdate = (data: AdvertisementUpdateRequest): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/advertisement/update',
        method: 'put',
        data: data
    });
}

export interface AdvertisementListRequest extends PageInfo {
    title: string | null;
    content: string | null;
}

export const advertisementList = (data: AdvertisementListRequest): Promise<ApiResponse<PageResult<Advertisement>>> => {
    return service({
        url: '/advertisement/list',
        method: 'get',
        params: data,
    });
}
