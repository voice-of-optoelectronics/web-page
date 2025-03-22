import { createApp } from 'vue'
import './style.css'
import  'element-plus/dist/index.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import {createRouter, createWebHashHistory} from "vue-router";

const route = [
    {
        path:'/',
        component:()=>import("./page/home.vue")
    }
]

const router = createRouter({
    routes:route,
    history:createWebHashHistory()
})

const app = createApp(App)
app.use(router).use(ElementPlus).mount("#app")
