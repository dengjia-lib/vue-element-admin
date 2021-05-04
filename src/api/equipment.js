import request from '@/utils/request'

export function getEquById(id) {
  return request({
    url: 'http://localhost:8080/equ/' + id,
    method: 'get'
  })
}

export function getEquVOById(id) {
  return request({
    url: 'http://localhost:8080/equ/vo/' + id,
    method: 'get'
  })
}

export function deleteEqu(id) {
  return request({
    url: 'http://localhost:8080/equ/' + id,
    method: 'delete'
  })
}

export function addEqu(data) {
  return request({
    url: 'http://localhost:8080/equ/addVO',
    method: 'post',
    data
  })
}

/**
 * 参数roomId：当前实践室的id
 * 接口nowRU：nowRoomUsers的缩写（代表指定实践室的所有用户）
 */
export function getNowRoomUsers(roomId) {
  return request({
    url: 'http://localhost:8080/equ/nowRU/' + roomId,
    method: 'get'
  })
}

export function modifyEqu(data) {
  return request({
    url: 'http://localhost:8080/equ/modify',
    method: 'put',
    data
  })
}

export function getEquCate() {
  return request({
    url: 'http://localhost:8080/equCate/all',
    method: 'get'
  })
}

export function getEquState() {
  return request({
    url: 'http://localhost:8080/equState/all',
    method: 'get'
  })
}

export function getEquUseCate() {
  return request({
    url: 'http://localhost:8080/equUseCate/all',
    method: 'get'
  })
}

export function applyForUseEquipment(data) {
  return request({
    url: 'http://localhost:8080/equ/apply',
    method: 'get',
    params: {
      userId: data.userId,
      equId: data.equId
    }
  })
}

export function applyInfoForUseEquipment(data) {
  return request({
    url: 'http://localhost:8080/equ/applyInfo',
    method: 'get',
    params: {
      userId: data.userId,
      equId: data.equId,
      equQuantity: data.equQuantity,
      equUseCate: data.equUseCate,
      equUseTime: data.equUseTime,
      equDay: data.equDay,
      remark: data.remark
    }
  })
}

export function showMyApplyRecords() {
  return request({
    url: 'http://localhost:8080/equApproval/applying',
    method: 'get'
  })
}

export function showMyApprovalRecords() {
  return request({
    url: 'http://localhost:8080/equApproval/applying',
    method: 'get'
  })
}

export function cancelApplication(id) {
  return request({
    url: 'http://localhost:8080/equApproval/cancel/' + id,
    method: 'get'
  })
}

export function showOneApproval(id) {
  return request({
    url: 'http://localhost:8080/equApproval/show/' + id,
    method: 'get'
  })
}

export function passOneApproval(id) {
  return request({
    url: 'http://localhost:8080/equApproval/pass/' + id,
    method: 'post'
  })
}

/**
 *
 * @param id 申请id
 * @param itsTime 用户是否提前开始使用设备，false -- 提前开始
 * @param startTime 用户开始使用设备的时间
 * @param day 用户借用设备的时间（天使）
 * @returns {AxiosPromise}
 */
export function startUseEquipment(id, itsTime, startTime, day) {
  return request({
    url: 'http://localhost:8080/equApproval/use/' + id,
    method: 'get',
    params: {
      itsTime: itsTime,
      startTime: startTime,
      day: day
    }
  })
}

export function rejectOneApproval(id) {
  return request({
    url: 'http://localhost:8080/equApproval/reject/' + id,
    method: 'post'
  })
}

export function reApplyUseEquipment(id) {
  return request({
    url: 'http://localhost:8080/equApproval/reApply/' + id,
    method: 'get'
  })
}

export function removeOneApproval(id) {
  return request({
    url: 'http://localhost:8080/equApproval/remove/' + id,
    method: 'put'
  })
}

export function showUsingEqu() {
  return request({
    url: 'http://localhost:8080/equApproval/using',
    method: 'get'
  })
}

/**
 * 普通用户归还已经使用完的设备
 */
export function returnThisEquipment(id) {
  return request({
    url: 'http://localhost:8080/equApproval/return/' + id,
    method: 'get'
  })
}

/**
 * 管理员查看所有使用者归还的设备
 */
export function showReturnedEqu() {
  return request({
    url: 'http://localhost:8080/equApproval/returned',
    method: 'get'
  })
}

/**
 * 管理员查看所有用户归还且已入库的设备
 */
export function showStoredEqu() {
  return request({
    url: 'http://localhost:8080/equApproval/stored',
    method: 'get'
  })
}

/**
 * 管理员查看所有用户归还且维修中的设备
 */
export function showRepairingEqu() {
  return request({
    url: 'http://localhost:8080/equApproval/repairing',
    method: 'get'
  })
}

/**
 * 管理员查看所有用户归还且已报废的设备
 */
export function showScrappedEqu() {
  return request({
    url: 'http://localhost:8080/equApproval/scrapped',
    method: 'get'
  })
}

/**
 * 设备无恙，管理员入库设备。（全部入库）
 */
export function storeReturnedEqu(id) {
  return request({
    url: 'http://localhost:8080/equApproval/store/' + id,
    method: 'put'
  })
}

/**
 * 设备无恙，管理员入库设备。（指定数量）
 */
export function storePartReturnedEqu(id, num) {
  return request({
    url: 'http://localhost:8080/equApproval/store',
    method: 'put',
    params: {
      id: id,
      num: num
    }
  })
}

/**
 * 设备小损，需要维修
 */
export function maintainReturnedEqu(data) {
  return request({
    url: 'http://localhost:8080/equApproval/maintain',
    method: 'post',
    data
  })
}

/**
 * 维修
 */
export function maintainPartReturnedEqu(data) {
  return request({
    url: 'http://localhost:8080/equApproval/maintain',
    method: 'post',
    params: {}
  })
}

/**
 * 设备大损，报废（ 报废所有 ）
 */
export function scrapReturnedEqu(id) {
  return request({
    url: 'http://localhost:8080/equApproval/scrap/' + id,
    method: 'put'
  })
}

/**
 * 设备大损，报废（ 报废指定数量 ）
 */
export function scrapPartReturnedEqu(id, num) {
  return request({
    url: 'http://localhost:8080/equApproval/scrap',
    method: 'put',
    params: {
      id: id,
      num: num
    }
  })
}

export function recordALog(id) {
  return request({
    url: 'http://localhost:8080/equApproval/record/' + id,
    method: 'post'
  })
}

