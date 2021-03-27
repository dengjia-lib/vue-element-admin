import request from '@/utils/request'

export function getTheNumOfBorrow(userId) {
  return request({
    url: 'http://localhost:8080/equApprovalLog/total/' + userId,
    method: 'get'
  })
}
