import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'http://localhost:8080/login',
    // 设置成表单提交
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'post',
    data
  })
}

export function registerUser(data) {
  return request({
    url: 'http://localhost:8080/register',
    method: 'post',
    data
  })
}

// export function registerUser() {
//   return request({
//     url: 'http://localhost:8080/register',
//     method: 'post'
//   })
// }

export function getInfo(token) {
  return request({
    url: 'http://localhost:8080/getUserVOInfo',
    method: 'get',
    token
  })
}

export function getUserById(id) {
  return request({
    url: 'http://localhost:8080/user/' + id,
    method: 'get'
  })
}

export function getUserByLoginName(loginName) {
  return request({
    url: 'http://localhost:8080/user/vo/name/' + loginName,
    method: 'get'
  })
}

export function getAllUsers() {
  return request({
    url: 'http://localhost:8080/user/all',
    method: 'get'
  })
}

export function deleteUser(id) {
  return request({
    url: 'http://localhost:8080/user/' + id,
    method: 'delete'
  })
}

export function modifyProfile(data) {
  return request({
    url: 'http://localhost:8080/user/modifyProfile',
    method: 'put',
    data
  })
}

export function modifyUser(data) {
  return request({
    url: 'http://localhost:8080/user/modify',
    method: 'put',
    data
  })
}

/**
 * 用户修改密码
 */
export function changePwd(data) {
  return request({
    url: 'http://localhost:8080/user/changePwd',
    method: 'get',
    params: {
      oldPwd: data.oldPwd,
      newPwd: data.newPwd
    }
  })
}

// 修改用户的角色列表 需要参数：userId，roleId 比如
// 用户：1，roleList：1-2-3
export function modifyUserRole(data) {
  return request({
    url: 'http://localhost:8080/userRole/modify',
    method: 'put',
    data
  })
}

export function addUser(data) {
  return request({
    url: 'http://localhost:8080/user/add',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: 'http://localhost:8080/logout',
    method: 'post'
  })
}
