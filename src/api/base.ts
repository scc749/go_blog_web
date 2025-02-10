import service from "@/utils/request";
import type {ApiResponse} from "@/utils/request";

export interface CaptchaResponse {
    captcha_id: string;
    pic_path: string;
}

export const captcha = (): Promise<ApiResponse<CaptchaResponse>> => {
    return service({
        url: '/base/captcha',
        method: 'post',
    })
}

export interface EmailRequest {
    email: string;
    captcha: string;
    captcha_id: string;
}

export const sendEmailVerificationCode = (data: EmailRequest):Promise<ApiResponse<undefined>> => {
    return service({
        url: '/base/sendEmailVerificationCode',
        method: 'post',
        data: data,
    })
}

export const qqLoginURL = (): Promise<ApiResponse<string>> => {
    return service({
        url: '/base/qqLoginURL',
        method: 'get',
    })
}
