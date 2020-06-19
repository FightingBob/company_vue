import request from '@/utils/request'

export function listExpend(params) {
  return request({
    url: '/expend/list',
    method: 'get',
    params
  })
}

export function listExpendAll(params) {
  return request({
    url: '/expend/listAll',
    method: 'get',
    params
  })
}

export function listBySelf(params) {
  return request({
    url: '/expend/listBySelf',
    method: 'get',
    params
  })
}

export function listBySelfAll(params) {
  return request({
    url: '/expend/listBySelfAll',
    method: 'get',
    params
  })
}
