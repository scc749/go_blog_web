import service from "@/utils/request";
import type {ApiResponse} from "@/utils/request";
import type {Model, PageInfo, PageResult} from "@/api/common";

export interface FriendLink extends Model {
    logo: string;
    link: string;
    name: string;
    description: string;
}

export interface FriendLinkInfoResponse {
    list: FriendLink[]
    total: number
}

export const friendLinkInfo = (): Promise<ApiResponse<FriendLinkInfoResponse>> => {
    return service({
        url: '/friendLink/info',
        method: 'get',
    });
}

export interface FriendLinkCreateRequest {
    logo: string;
    link: string;
    name: string;
    description: string;
}

export const friendLinkCreate = (data: FriendLinkCreateRequest): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/friendLink/create',
        method: 'post',
        data: data
    });
}

export interface FriendLinkDeleteRequest {
    ids: number[];
}

export const friendLinkDelete = (data: FriendLinkDeleteRequest): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/friendLink/delete',
        method: 'delete',
        data: data
    });
}

export interface FriendLinkUpdateRequest {
    id: number;
    link: string;
    name: string;
    description: string;
}

export const friendLinkUpdate = (data: FriendLinkUpdateRequest): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/friendLink/update',
        method: 'put',
        data: data
    });
}

export interface FriendLinkListRequest extends PageInfo {
    name: string | null;
    description: string | null;
}

export const friendLinkList = (data: FriendLinkListRequest): Promise<ApiResponse<PageResult<FriendLink>>> => {
    return service({
        url: '/friendLink/list',
        method: 'get',
        params: data,
    });
}
