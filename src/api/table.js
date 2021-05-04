import request from '@/utils/request'
import page from '@/views/permission/page'

export function getList(params) {
  return request({
    url: '/vue-element-admin/table/list',
    method: 'get',
    params
  })
}

export function getUserList(data) {
  return request({
    url: 'http://localhost:8080/user/vo',
    method: 'get',
    params: {
      page: data.page,
      limit: data.limit
    }
  })
}

export function fetchUserListByQuery(data) {
  return request({
    url: 'http://localhost:8080/user/vo/query',
    method: 'get',
    params: {
      page: data.page,
      limit: data.limit,
      realName: data.realName,
      userRole: data.userRole,
      userRoom: data.userRoom
    }
  })
}

export function getEquList(data) {
  return request({
    url: 'http://localhost:8080/equ/vo',
    method: 'get',
    params: {
      page: data.page,
      limit: data.limit
    }
  })
}

export function fetchEquListByQuery(data) {
  return request({
    url: 'http://localhost:8080/equ/vo/query',
    method: 'get',
    params: {
      page: data.page,
      limit: data.limit,
      equName: data.equName,
      equCate: data.equCate,
      equRoom: data.equRoom,
      equState: data.equState
    }
  })
}

export function getLogList(data) {
  return request({
    url: 'http://localhost:8080/log/page',
    method: 'get',
    params: {
      page: data.page,
      limit: data.limit
    }
  })
}

export function getRoomInfo() {
  return request({
    url: 'http://localhost:8080/room/all',
    method: 'get'
  })
}

export function getRoleInfo() {
  return request({
    url: 'http://localhost:8080/role/all',
    method: 'get'
  })
}

export function getTheMapOfCate() {
  return request({
    url: 'http://localhost:8080/equCate/map',
    method: 'get'
  })
}

export function getTheMapWithNameOfCate() {
  return request({
    url: 'http://localhost:8080/equCate/mapWithName',
    method: 'get'
  })
}
