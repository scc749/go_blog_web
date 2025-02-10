import service from "@/utils/request";
import type {ApiResponse} from "@/utils/request";
import type {Model, PageInfo, PageResult} from "@/api/common";

export interface User extends Model {
    uuid: string;
    username: string;
    email: string;
    openid: string;
    avatar: string;
    address: string;
    signature: string;
    role_id: number;
    register: string;
    freeze: boolean;
}

export interface RegisterRequest {
    username: string;
    password: string;
    email: string;
    verification_code: string;
}

export const register = (data: RegisterRequest): Promise<ApiResponse<LoginResponse>> => {
    return service({
        url: '/user/register',
        method: 'post',
        data: data
    });
}

export interface LoginRequest {
    email: string;
    password: string;
    captcha: string;
    captcha_id: string;
}

export interface LoginResponse {
    user: User;
    access_token: string;
    access_token_expires_at: number;
}

export const login = (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return service({
        url: '/user/login',
        method: 'post',
        data: data
    });
}

export interface ForgotPasswordRequest {
    email: string;
    verification_code: string;
    new_password: string;
}

export const forgotPassword = (data: ForgotPasswordRequest): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/user/forgotPassword',
        method: 'post',
        data: data
    });
}

export interface UserCardRequest {
    uuid: string;
}

export interface UserCardResponse {
    uuid: string;
    username: string;
    avatar: string;
    address: string;
    signature: string;
}

export const userCard = (data: UserCardRequest): Promise<ApiResponse<UserCardResponse>> => {
    return service({
        url: '/user/card',
        method: 'get',
        params: data
    });
}

export const logout = (): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/user/logout',
        method: 'post',
    });
}

export interface UserResetPasswordRequest {
    password: string;
    new_password: string;
}

export const userResetPassword = (data: UserResetPasswordRequest): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/user/resetPassword',
        method: 'put',
        data: data
    })
}

export const userInfo = (): Promise<ApiResponse<User>> => {
    return service({
        url: '/user/info',
        method: 'get',
    });
}

export interface UserChangeInfoRequest {
    username: string;
    address: string;
    signature: string;
}

export const userChangeInfo = (data: UserChangeInfoRequest): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/user/changeInfo',
        method: 'put',
        data: data
    })
}

export const userWeather = (): Promise<ApiResponse<string>> => {
    return service({
        url: '/user/weather',
        method: 'get',
    })
}

export interface UserChartRequest {
    date: number;
}

export interface UserChartResponse {
    date_list: string[];
    login_data: number[];
    register_data: number[];
}

export const userChart = (data: UserChartRequest): Promise<ApiResponse<UserChartResponse>> => {
    return service({
        url: '/user/chart',
        method: 'get',
        params: data,
    })
}


export interface UserListRequest extends PageInfo {
    uuid: string | null;
    register: string | null;
}

export const userList = (data: UserListRequest): Promise<ApiResponse<PageResult<User>>> => {
    return service({
        url: '/user/list',
        method: 'get',
        params: data
    })
}

export interface UserOperation {
    id: number;
}

export const userFreeze = (data: UserOperation): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/user/freeze',
        method: 'put',
        data: data
    })
}

export const userUnfreeze = (data: UserOperation): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/user/unfreeze',
        method: 'put',
        data: data
    })
}

export interface UserLoginListRequest extends PageInfo {
    uuid: string | null;
}

export interface Login extends Model {
    user_id: string;
    user: User;
    login_method: string;
    ip: string;
    address: string;
    os: string;
    device_info: string;
    browser_info: string;
    status: string;
}

export const userLoginList = (data: UserLoginListRequest): Promise<ApiResponse<PageResult<Login>>> => {
    return service({
        url: '/user/loginList',
        method: 'get',
        params: data
    })
}
