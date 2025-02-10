import type {Hit, PageInfo, PageResult} from "@/api/common";
import type {ApiResponse} from "@/utils/request";
import service from "@/utils/request";

export interface Article {
    created_at: string;
    updated_at: string;

    cover: string;
    title: string;
    keyword: string;
    category: string;
    tags: string[];
    abstract: string;
    content: string;

    views: number;
    comments: number;
    likes: number;
}

export interface ArticleLikeRequest {
    article_id: string;
}

export const articleLike = (data: ArticleLikeRequest): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/article/like',
        method: 'post',
        data: data
    })
}

export const articleIsLike = (data: ArticleLikeRequest): Promise<ApiResponse<boolean>> => {
    return service({
        url: '/article/isLike',
        method: 'get',
        params: data
    })
}

export const articleLikesList = (data: PageInfo): Promise<ApiResponse<PageResult<Hit<Article>>>> => {
    return service({
        url: '/article/likesList',
        method: 'get',
        params: data
    })
}

export interface ArticleCreateRequest {
    cover: string;
    title: string;
    category: string;
    tags: string[];
    abstract: string;
    content: string;
}

export const articleCreate = (data: ArticleCreateRequest): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/article/create',
        method: 'post',
        data: data
    });
}

export interface ArticleDeleteRequest {
    ids: string[];
}

export const articleDelete = (data: ArticleDeleteRequest): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/article/delete',
        method: 'delete',
        data: data
    });
}

export interface ArticleUpdateRequest {
    id: string;
    cover: string;
    title: string;
    category: string;
    tags: string[];
    abstract: string;
    content: string;
}

export const articleUpdate = (data: ArticleUpdateRequest): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/article/update',
        method: 'put',
        data: data
    });
}

export interface ArticleListRequest extends PageInfo {
    title: string | null;
    category: string | null;
    abstract: string | null;
}

export const articleList = (data: ArticleListRequest): Promise<ApiResponse<PageResult<Hit<Article>>>> => {
    return service({
        url: '/article/list',
        method: 'get',
        params: data,
    });
}

export const articleInfoByID = (id: string): Promise<ApiResponse<Article>> => {
    return service({
        url: '/article/'+id,
        method: 'get',
    });
}

export interface ArticleSearchRequest extends PageInfo {
    query: string;
    category: string;
    tag: string;
    sort: string;
    order: string;
}

export const articleSearch = (data: ArticleSearchRequest): Promise<ApiResponse<PageResult<Hit<Article>>>> => {
    return service({
        url: '/article/search',
        method: 'get',
        params: data,
    });
}

export interface ArticleCategory {
    category: string;
    number: number;
}

export const articleCategory = (): Promise<ApiResponse<ArticleCategory[]>> => {
    return service({
        url: '/article/category',
        method: 'get',
    });
}

export interface ArticleTag {
    tag: string;
    number: number;
}

export const articleTags = (): Promise<ApiResponse<ArticleTag[]>> => {
    return service({
        url: '/article/tags',
        method: 'get',
    });
}
