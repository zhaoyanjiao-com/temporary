import {createApp} from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import App from './App.vue'
import './assets/css/css.scss'

const app = createApp(App)
//设置默认弹出层级
app.use(ElementPlus, {zIndex: 2000, locale: zhCn})
app.mount('#app')
