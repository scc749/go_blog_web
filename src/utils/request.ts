import axios from "axios";
import type {AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig} from "axios";
import {useUserStore} from '@/stores/user';
import router from '@/router/index';
import {useLayoutStore} from "@/stores/layout";

const service = axios.create({
    baseURL: import.meta.env.VITE_BASE_API,
    timeout: 10000,
})

export interface ApiResponse<T> {
    code: number;
    msg: string;
    data: T;
}

service.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        const userStore = useUserStore();
        config.headers = {
            'Content-Type': 'application/json',
            'x-access-token': userStore.state.accessToken,
            ...config.headers,
        }
        return config as InternalAxiosRequestConfig
    },
    (error: AxiosError) => {
        ElMessage.error({
            showClose: true,
            message: error.message,
            type: 'error',
        })
        return Promise.reject(error)
    }
)

service.interceptors.response.use(
    (response: AxiosResponse) => {
        const userStore = useUserStore()
        if (response.headers['new-access-token']) {
            userStore.state.accessToken = (response.headers['new-access-token'])
        }
        if (response.data.code !== 0) {
            ElMessage.error(response.data.msg)

            if (response.data.data && response.data.data.reload) {
                userStore.reset()
                const layoutStore = useLayoutStore()
                localStorage.clear()
                router.push({name: 'index', replace: true}).then(() => {
                    layoutStore.state.popoverVisible = true
                    layoutStore.state.loginVisible = true
                })
            }
        }
        return response.data
    },
    (error: AxiosError) => {
        if (!error.response) {
            ElMessageBox.confirm(`
        <p>检测到请求错误</p>
        <p>${error.message}</p>
      `, '请求报错', {
                dangerouslyUseHTMLString: true,
                distinguishCancelAndClose: true,
                confirmButtonText: '稍后重试',
                cancelButtonText: '取消',
            }).then()
            return Promise.reject(error)
        }

        switch (error.response.status) {
            case 500:
                return handleSpecificError(500, error)
            case 404:
                return handleSpecificError(404, error)
            case 403:
                return handleSpecificError(403, error)
        }
        return Promise.reject(error)
    }
);

// 处理具体错误状态
const handleSpecificError = (status: number, error: AxiosError) => {
    const errorMessages: { [key: number]: string } = {
        500: `
            <p>检测到接口错误: ${error.message}</p>
            <p>错误码：<span style="color:red">500</span></p>
            <p>此类错误通常由后台服务器发生不可预料的错误（如panic）引起。请先查看后台日志以获取更多信息。</p>
            <p>如果此错误影响您的正常使用，建议您清理缓存并重新登录。</p>
        `,
        404: `
            <p>检测到接口错误: ${error.message}</p>
            <p>错误码：<span style="color:red">404</span></p>
            <p>此错误通常表示请求的接口未注册（或服务未重启）或请求路径（方法）与API路径（方法）不符。</p>
            <p>请检查您请求的URL和方法，确保它们正确无误。</p>
        `,
        403: `
            <p>检测到权限错误: ${error.message}</p>
            <p>错误码：<span style="color:red">403</span></p>
            <p>您没有权限访问此路由（admin）。请确认您的用户角色是否具备访问该页面的权限。</p>
            <p>如果您认为这是一个错误，请联系系统管理员获取帮助。</p>
        `,
    }

    ElMessageBox.confirm(errorMessages[status], '接口报错', {
        dangerouslyUseHTMLString: true,
        distinguishCancelAndClose: true,
        confirmButtonText: '清理缓存',
        cancelButtonText: '取消',
    }).then(() => {
        const userStore = useUserStore()
        userStore.reset()
        const layoutStore = useLayoutStore()
        localStorage.clear()
        router.push({name: 'index', replace: true}).then(() => {
            layoutStore.state.popoverVisible = true
            layoutStore.state.loginVisible = true
        });
    });

    return Promise.reject(error)
};

export default service
