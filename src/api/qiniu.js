import request from '@/utils/request'

export function getToken() {
  return request({
    url: 'http://localhost:8080/user/upload/token',
    method: 'get'
  })
}
