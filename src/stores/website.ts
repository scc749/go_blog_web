import {defineStore} from "pinia";
import {ref} from 'vue';
import type {Website} from "@/api/config";
import {websiteInfo} from "@/api/website";


function initState() {
    const websiteInfo = ref<Website>({
        logo:'',
        full_logo:'',
        title: '',
        slogan: '',
        slogan_en: '',
        description: '',
        version: '',
        created_at: '',
        icp_filing: '',
        public_security_filing: '',
        bilibili_url: '',
        gitee_url: '',
        github_url: '',
        name: '',
        job: '',
        address: '',
        email: '',
        qq_image: '',
        wechat_image: '',
    })
    return {websiteInfo, websiteInfoInitialized: false,}
}

export const useWebsiteStore = defineStore('website', () => {
    const state = ref(initState())
    const initializeWebsite = async () => {
        if (!state.value.websiteInfoInitialized) {
            const res = await websiteInfo()
            if (res.code === 0) {
                state.value.websiteInfo = res.data // 更新 website
                state.value.websiteInfoInitialized = true
            }
        }
    }
    return {state, initializeWebsite}
})
