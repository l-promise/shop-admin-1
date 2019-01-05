// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

// 导入路由配置
import router from './router'

// 导入element-ui
import ElementUI from 'element-ui'
// 导入element-ui的样式文件
import 'element-ui/lib/theme-chalk/index.css'

// 导入自己的样式
import './assets/css/index.css'

// 导入axios
import axios from 'axios'
// 如何做到能够在任意组件中使用axios？
// 方式：将axios添加到Vue原型中，那么，任意的实例中就可以直接通过 this 来直接获取到axios
// 注意：对于不是 Vue 插件，但是还想在任意组件中使用的模块，都可以添加到 Vue 原型中
Vue.prototype.$http = axios

// 配置基准路径：
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'

// 请求拦截器
// 说明：因为只要是 axios 发送的请求，都会执行 请求拦截器 中的代码
//      所以,可以在 请求拦截器 中, 一次性添加请求头
axios.interceptors.request.use(config => {
  // 统一添加 Authorization 请求头
  config.headers.Authorization = localStorage.getItem('token')
  // 一定要返回 config
  return config
})

// 响应拦截器
// axios.interceptors.response.use(
//   response => {
//     console.log('响应拦截器：', response)
//     // 所有请求完成后都要执行的操作
//     return response
//   },
//   error => {
//     // 错误处理
//     return Promise.reject(error)
//   }
// )

// 安装插件
Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  // 关联
  router,
  components: { App },
  template: '<App/>'
})
