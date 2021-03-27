import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建一个axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 3600000 // 请求超时(请求60s后仍不成功,将给出提示.)
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做一些事情
    if (store.getters.token) {
      // 让每个请求都带有令牌
      // 请根据实际情况进行修改
      // ['X-Token'] is a custom headers key
      // config.headers['X-Token'] = getToken()
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    // 请求错误时做一些事情
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    console.log('response....................')
    console.log(response)
    const res = response.data
    // 如果自定义代码不是20000，则将其判断为错误。
    console.log(res.code)
    if (res.code !== 20000) {
      Message({
        message: res.message || 'Error(!=20000)，用户登录失败。',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: 非法令牌; 50012: 其他客户登录; 50014: 令牌已过期;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login用户的申请信息
        MessageBox.confirm('您已登出，可以点击取消来停留在此页面上，或者再次登录。', '用户已登出', {
          confirmButtonText: '登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
