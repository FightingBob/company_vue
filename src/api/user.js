import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/admin/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}

// 更换头像
export function updateAvatar(data) {
  return request({
    url: '/admin/updateIcon',
    method: 'post',
    data
  })
}

// 修改个人信息
export function updateInfo(data) {
  return request({
    url: '/admin/updateInfo',
    method: 'post',
    data
  })
}

// 修改密码
export function updatePassword(data) {
  return request({
    url: '/admin/updatePassword',
    method: 'post',
    data
  })
}
