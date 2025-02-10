import type {ApiResponse} from "@/utils/request";
import service from "@/utils/request";
import type {Website} from "@/api/config";

export const websiteInfo = (): Promise<ApiResponse<Website>> => {
    return service({
        url: '/website/info',
        method: 'get',
    })
}

export const websiteCarousel = (): Promise<ApiResponse<string[]>> => {
    return service({
        url: '/website/carousel',
        method: 'get',
    })
}

export interface WebsiteNewsRequest {
    source: string;
}

export interface HotItem {
    index: number;
    title: string;
    description: string;
    image: string;
    popularity: string;
    url: string;
}

export interface HotSearchData {
    source: string;
    update_time: string;
    hot_list: HotItem[];
}

export const websiteNews = (data: WebsiteNewsRequest): Promise<ApiResponse<HotSearchData>> => {
    return service({
        url: '/website/news',
        method: 'get',
        params: data,
    })
}

export interface WebsiteCalendarResponse {
    date: string;
    lunar_date: string;
    ganzhi: string;
    zodiac: string;
    day_of_year: string;
    solar_term: string;
    auspicious: string;
    inauspicious: string;
}

export const websiteCalendar = (): Promise<ApiResponse<WebsiteCalendarResponse>> => {
    return service({
        url: '/website/calendar',
        method: 'get',
    })
}

export interface FooterLink {
    title: string;
    link: string;
}

export const websiteFooterLink = (): Promise<ApiResponse<FooterLink[]>> => {
    return service({
        url: '/website/footerLink',
        method: 'get',
    })
}

export interface WebsiteCarouselOperation {
    url: string
}

export const websiteAddCarousel = (data: WebsiteCarouselOperation): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/website/addCarousel',
        method: 'post',
        data: data,
    })
}

export const websiteCancelCarousel = (data: WebsiteCarouselOperation): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/website/cancelCarousel',
        method: 'put',
        data: data,
    })
}

export const websiteCreateFooterLink = (data: FooterLink): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/website/createFooterLink',
        method: 'post',
        data: data,
    })
}

export const websiteDeleteFooterLink = (data: FooterLink): Promise<ApiResponse<undefined>> => {
    return service({
        url: '/website/deleteFooterLink',
        method: 'delete',
        data: data,
    })
}
