import type {ApiResponse} from "@/utils/request";
import service from "@/utils/request";

export interface Website {
    logo: string;
    full_logo: string;
    title: string;
    slogan: string;
    slogan_en: string;
    description: string;
    version: string;
    created_at: string;
    icp_filing: string;
    public_security_filing: string;
    bilibili_url: string;
    gitee_url: string;
    github_url: string;
    name: string;
    job: string;
    address: string;
    email: string;
    qq_image: string;
    wechat_image: string;
}

export const getWebsite = (): Promise<ApiResponse<Website>> => {
    return service({
        url: '/config/website',
        method: 'get',
    })
}

export const updateWebsite = (data: Website): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/config/website',
        method: 'put',
        data: data,
    })
}

export interface System{
    use_multipoint:boolean;
    sessions_secret:string;
    oss_type:string;
}

export const getSystem = (): Promise<ApiResponse<System>> => {
    return service({
        url: '/config/system',
        method: 'get',
    })
}

export const updateSystem = (data: System): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/config/system',
        method: 'put',
        data: data,
    })
}

export interface Email {
    host: string;
    port: number;
    from: string;
    nickname: string;
    secret: string;
    is_ssl: boolean;
}

export const getEmail = (): Promise<ApiResponse<Email>> => {
    return service({
        url: '/config/email',
        method: 'get',
    })
}

export const updateEmail = (data: Email): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/config/email',
        method: 'put',
        data: data,
    })
}

export interface QQ {
    enable: boolean;
    app_id: string;
    app_key: string;
    redirect_uri: string;
}

export const getQQ = (): Promise<ApiResponse<QQ>> => {
    return service({
        url: '/config/qq',
        method: 'get',
    })
}

export const updateQQ = (data: QQ): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/config/qq',
        method: 'put',
        data: data,
    })
}

export interface Qiniu {
    zone: string;
    bucket: string;
    img_path: string;
    access_key: string;
    secret_key: string;
    use_https: boolean;
    use_cdn_domains: boolean;
}

export const getQiniu = (): Promise<ApiResponse<Qiniu>> => {
    return service({
        url: '/config/qiniu',
        method: 'get',
    })
}

export const updateQiniu = (data: Qiniu): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/config/qiniu',
        method: 'put',
        data: data,
    })
}

export interface Jwt {
    access_token_secret: string;
    refresh_token_secret: string;
    access_token_expiry_time: string;
    refresh_token_expiry_time: string;
    issuer: string;
}

export const getJwt = (): Promise<ApiResponse<Jwt>> => {
    return service({
        url: '/config/jwt',
        method: 'get',
    })
}

export const updateJwt = (data: Jwt): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/config/jwt',
        method: 'put',
        data: data,
    })
}

export interface Gaode {
    enable: boolean;
    key: string;
}

export const getGaode = (): Promise<ApiResponse<Gaode>> => {
    return service({
        url: '/config/gaode',
        method: 'get',
    })
}

export const updateGaode = (data: Gaode): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/config/gaode',
        method: 'put',
        data: data,
    })
}
