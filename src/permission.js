import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import { getToken } from '@/utils/auth' // 从 localStorage 获取令牌
import getPageTitle from '@/utils/get-page-title'
import axios from 'axios'
import { config } from '@vue/test-utils'

// 进度条
NProgress.configure({ showSpinner: false }) // NProgress配置
// 白名单
const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist
// 路由之前，逻辑判定
router.beforeEach(async(to, from, next) => {
  // 开始进度条
  NProgress.start()
  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 确定用户是否已登录
  const hasToken = getToken()
  if (hasToken) {
    // 有 token
    if (to.path === '/login') {
      // 如果想去 login 则跳到 首页
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      // 如果是其他页面先判定是否有角色，
      // 确定用户是否已通过getInfo获得其权限角色
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        // 有的话就跳过去，
        next()
      } else {
        try {
          // 没有的话发请求得到当前登录用户信息。
          // 注意：角色必须是对象数组！例如：['admin']或，['visitor', 'admin', 'superadmin']
          const { roles } = await store.dispatch('user/getInfo')
          // 根据角色调用函数生成可访问的路由表
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          // 动态添加可访问的路由
          router.addRoutes(accessRoutes)
          // hack方法，以确保addRoutes是完整的
          // 设置replace：true，因此导航将不会留下历史记录
          next({ ...to, replace: true })
        } catch (error) {
          // 报错要么没权限，要么是请求超时，就要返回 error，清除 token
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          // 返回登录页。
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 在登录白名单中，直接进入
      next()
    } else {
      // 不在白名单中，且无权访问的页面将重定向到登录页面。
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

// 完成进度条 NProgress
router.afterEach(() => {
  NProgress.done()
})
