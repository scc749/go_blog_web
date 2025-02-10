import {createApp} from 'vue'
import '@/assets/base.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import {pinia} from "@/stores";

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(pinia).use(router)

app.mount('#app')
