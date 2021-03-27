import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/vue-element-admin/routes',
    method: 'get'
  })
}

export function getAllRoutes() {
  return request({
    // TODO 1、后端提供全部的菜单数据
    url: 'http://localhost:8080/menu/all',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/vue-element-admin/roles',
    method: 'get'
  })
}

export function getAllRoles() {
  return request({
    url: 'http://localhost:8080/role/vo/all',
    method: 'get'
  })
}

/**
 * 测试，后面删除
 */
export function getOneVORoles(id) {
  return request({
    url: 'http://localhost:8080/role/vo/' + id,
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/vue-element-admin/role',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: 'delete'
  })
}
