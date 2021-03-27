import { asyncRoutes, constantRoutes } from '@/router'

/**
 * 使用meta.roles确定当前用户是否具有权限
 * @param roles 当前登录用户的权限列表
 * @param route 决定是否展示的路由
 * @returns {boolean|*}
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    // .some()方法，数组任意一个元素为true，返回true。数组全部元素为false，返回false。
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    // 如果未设置角色，则表示：该页面不需要权限。
    return true
  }
}

/**
 * 通过递归过滤异步路由表
 * 递归地判定 asyncRoutes.roles 属性是否有该角色（权限）
 * @param routes 全部的异步路由
 * @param roles 用户的角色列表
 * @returns {[]}
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      // 如果根菜单有权限就将此路由添加到 accessedRoutes
      res.push(tmp)
    }
  })
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    // concat 方法用于连接两个或多个数组, 完成更新路由表
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  /**
   * 根据角色生成可访问的路由表
   * @param commit
   * @param roles
   * @returns {Promise<unknown>}
   */
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      // 判断用户角色是否包含 superadmin
      if (roles.includes('SUPERADMIN')) {
        // 是则将所有 asyncRoutes（动态路由）加入到 constantRoutes（恒定路由）。
        accessedRoutes = asyncRoutes || []
      } else {
        // 若用户角色没有包含 superadmin，则调用 filterAsyncRoutes 函数，
        // 递归地判定 asyncRoutes.roles 属性是否有该角色，即是否有权限，
        // 将有权限的 router 赋值 accessedRoutes 后加入到 constantRoutes。
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
