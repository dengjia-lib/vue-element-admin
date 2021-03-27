import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import '@/styles/index.scss' // 全局CSS

import App from './App'
import store from './store'
import router from './router'

import './icons' // 图标
import './permission' // 权限控制
import './utils/error-log' // 错误日志

import * as filters from './filters'
import axios from 'axios' // 全局过滤器

// // 引入echarts
// import echarts from 'echarts'
// Vue.prototype.$echarts = echarts

/**
 * 如果您不想使用模拟服务器，想将MockJs用于模拟api，你可以执行：mockXHR（）
 * 目前，MockJs将在生产环境中使用，请在上线之前将其删除!!!
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

Vue.use(Element, {
  size: Cookies.get('size') || 'mini', // 设置element-ui默认大小
  locale: enLang // 如果使用中文，无需设置，请删除
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  // 使用render函数我们可以用js语言来构建DOM
  // createElement, 约定的简写 h
  render: h => h(App)
})

// 让ajax携带cookie（解决vue每次请求后端服务器都被看做是一次新的请求的问题）
axios.defaults.withCredentials = true
