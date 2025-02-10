import type {Model, PageInfo, PageResult} from "@/api/common";
import service from "@/utils/request";
import type {ApiResponse} from "@/utils/request";
import type {User} from "@/api/user";

export interface Comment extends Model {
    article_id: string;
    p_id: number | null;
    children: Comment[];
    user_uuid: string;
    user: User;
    content: string;
}

export interface CommentCreateRequest {
    article_id: string;
    p_id: number | null;
    content: string;
}

export const commentCreate = (data: CommentCreateRequest): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/comment/create',
        method: 'post',
        data: data,
    })
}

export interface CommentDeleteRequest {
    ids: number[];
}

export const commentDelete = (data: CommentDeleteRequest): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/comment/delete',
        method: 'delete',
        data: data,
    })
}

export const commentInfo = (): Promise<ApiResponse<Comment[]>> => {
    return service({
        url: '/comment/info',
        method: 'get',
    });
}

export const commentInfoByArticleID = (article_id: string): Promise<ApiResponse<Comment[]>> => {
    return service({
        url: '/comment/' + article_id,
        method: 'get',
    })
}

export const commentNew = (): Promise<ApiResponse<Comment[]>> => {
    return service({
        url: '/comment/new',
        method: 'get',
    });
}

export interface CommentListRequest extends PageInfo {
    article_id: string | null;
    user_uuid: string | null;
    content: string | null;
}

export const commentList = (data: CommentListRequest): Promise<ApiResponse<PageResult<Comment>>> => {
    return service({
        url: '/comment/list',
        method: 'get',
        params: data,
    })
}

