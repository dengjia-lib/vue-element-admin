import request from '@/utils/request'

export function getTheNumOfBorrow() {
  return request({
    url: 'http://localhost:8080/equApprovalLog/totalNum',
    method: 'get'
  })
}

export function getTheQuantityOfBorrow() {
  return request({
    url: 'http://localhost:8080/equApprovalLog/totalQuantity',
    method: 'get'
  })
}

export function getTheUseCateScore() {
  return request({
    url: 'http://localhost:8080/equApprovalLog/useCateScore',
    method: 'get'
  })
}

export function getStrategy() {
  return request({
    url: 'http://localhost:8080/equApprovalLog/strategy',
    method: 'get'
  })
}

export function saveStrategy(data) {
  return request({
    url: 'http://localhost:8080/equApprovalLog/strategy',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    data
  })
}
