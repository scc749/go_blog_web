import {fileURLToPath, URL} from 'node:url'

import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import type {ImportMetaEnv} from "./env";

let env: Record<keyof ImportMetaEnv, string> = loadEnv("", process.cwd())

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        host: "0.0.0.0",
        port: 80,
        proxy: {
            "/api": {
                target: env.VITE_SERVER_URL,
                changeOrigin: true
            },
            "/uploads": {
                target: env.VITE_SERVER_URL,
                changeOrigin: true,
            },
        }
    }
})
