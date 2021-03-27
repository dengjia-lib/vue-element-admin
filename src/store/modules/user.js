import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import axios from 'axios'

const state = {
  token: getToken(),
  avatar: '',
  loginName: '',
  realName: '',
  introduction: '',
  roles: [],
  email: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
    localStorage.user_token = token
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_LOGINNAME: (state, loginName) => {
    state.loginName = loginName
  },
  SET_REALNAME: (state, realName) => {
    state.realName = realName
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_ROOM: (state, room) => {
    state.room = room
  },
  SET_USER: (state, token) => {
    // localStorage.setItem('user_name', 'admin')
    // localStorage.setItem('user_token', token)
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    // 使用Promise请求
    return new Promise((resolve, reject) => {
      const data = {
        username: username.trim(),
        password: password.trim()
      }
      const params = 'loginName=' + data.username + '&loginPwd=' + data.password
      login(params)
        .then(response => {
          const data = response
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  /* login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise(function(resolve, reject) {
      login({ username: username, password: password })
        .then(response => {
          alert('hellooooooo')
        })
        .catch(function(err) {
          console.log(err)
        })
    })
      .then(function(data) {
        console.log(data)
        console.log('这是成功操作')
      })
  },*/

  // get userInfo
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // let token = 'djosimon-token'
      // getInfo(token)
      getInfo(state.token)
        .then(response => {
          console.log('get userinfooooooooooooooooooooooooo')
          console.log(response)
          const { data } = response
          if (!data) {
            reject('认证失败，请重新登录。')
          }

          const { authorities } = data
          const roleList = []
          // for (let i = 0; i < authorities.length; i++) {
          //   roleList.push(authorities[i].authority)
          // }
          for (const authority of authorities) {
            roleList.push(authority.roleName)
          }

          const userInfo = {
            roles: roleList,
            loginName: data.loginName,
            realName: data.realName,
            id: data.id,
            avatar: data.userPicture,
            introduction: data.remark,
            email: data.userEmail,
            room: data.userRoom
          }
          // 角色必须是非空数组
          if (!roleList || roleList.length <= 0) {
            reject('getLoginUserInfo：角色必须为非null数组！')
          }
          commit('SET_ROLES', userInfo.roles)
          commit('SET_LOGINNAME', userInfo.loginName)
          commit('SET_REALNAME', userInfo.realName)
          commit('SET_ID', userInfo.id)
          commit('SET_AVATAR', userInfo.avatar)
          commit('SET_INTRODUCTION', userInfo.introduction)
          commit('SET_EMAIL', userInfo.email)
          commit('SET_ROOM', userInfo.room)
          resolve(userInfo)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        // 重置访问的视图和缓存的视图
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // 动态修改角色(角色其实就是一组权限的集合)
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'
    // const token = getToken()
    // const token = 'djosimon-04655815-6191-4850-89d7-10d10843f2c3'

    commit('SET_TOKEN', token)
    setToken(token) // cookie

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // 根据角色生成可访问的路由表
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // 动态添加可访问的路由
    router.addRoutes(accessRoutes)

    // 重置已访问的视图和已缓存的视图
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
