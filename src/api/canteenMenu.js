import request from '@/utils/request'

export function createMenu(data) {
  return request({
    url: '/foodMenu/create',
    method: 'post',
    data
  })
}

export function todayMenu() {
  return request({
    url: '/foodMenu/today',
    method: 'get'
  })
}

export function deleteFood(id, data) {
  return request({
    url: '/foodMenu/deleteFood/' + id,
    method: 'post',
    data
  })
}

export function updatePrice(id, price) {
  return request({
    url: '/foodMenu/updatePrice/' + id,
    method: 'post',
    params: {
      price
    }
  })
}

export function menuAddFood(id, data) {
  return request({
    url: '/foodMenu/addFood/' + id,
    method: 'post',
    data
  })
}

export function deleteMenu(menuId) {
  return request({
    url: '/foodMenu/delete',
    method: 'post',
    params: {
      menuId
    }
  })
}

export function updateStatus(menuId) {
  return request({
    url: '/foodMenu/updateStatus',
    method: 'post',
    params: {
      menuId
    }
  })
}
