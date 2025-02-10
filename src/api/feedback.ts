import type {ApiResponse} from "@/utils/request";
import service from "@/utils/request";
import type {Model, PageInfo, PageResult} from "@/api/common";

export interface Feedback extends Model{
    user_uuid: string;
    content: string;
    reply: string;
}

export interface FeedbackCreateRequest {
    content: string;
}

export const feedbackCreate = (data: FeedbackCreateRequest): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/feedback/create',
        method: 'post',
        data: data
    });
}

export const feedbackInfo = (): Promise<ApiResponse<Feedback[]>> => {
    return service({
        url: '/feedback/info',
        method: 'get',
    });
}

export interface FeedbackDeleteRequest {
    ids: number[];
}

export const feedbackDelete = (data: FeedbackDeleteRequest): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/feedback/delete',
        method: 'delete',
        data: data
    });
}

export interface FeedbackReplyRequest {
    id: number;
    reply: string;
}

export const feedbackReply = (data: FeedbackReplyRequest): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/feedback/reply',
        method: 'put',
        data: data
    });
}

export const feedbackList = (data: PageInfo): Promise<ApiResponse<PageResult<Feedback>>> => {
    return service({
        url: '/feedback/list',
        method: 'get',
        params: data,
    });
}

export const feedbackNew = (): Promise<ApiResponse<Feedback[]>> => {
    return service({
        url: '/feedback/new',
        method: 'get',
    });
}
