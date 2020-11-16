import request from '@/utils/request'

export function listStatistics(params) {
  return request({
    url: '/statistics/list',
    method: 'get',
    params
  })
}

export function listStatisticsAll(params) {
  return request({
    url: '/statistics/listAll',
    method: 'get',
    params
  })
}

export function importLastMonthSave(data) {
  return request({
    url: '/statistics/importLastMonthSave',
    method: 'post',
    data
  })
}
