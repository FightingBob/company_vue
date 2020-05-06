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

// 用户列表
export function fetchList(params) {
  return request({
    url: '/admin/list',
    method: 'get',
    params: params
  })
}

// 注册
export function createAdmin(data) {
  return request({
    url: '/admin/register',
    method: 'post',
    data
  })
}

// 获取用户的角色
export function getRoleByAdmin(id) {
  return request({
    url: '/admin/role/' + id,
    method: 'get'
  })
}

export function updateStatus(id, params) {
  return request({
    url: '/admin/updateStatus/' + id,
    method: 'post',
    params: params
  })
}

export function deleteAdmin(id) {
  return request({
    url: '/admin/delete/' + id,
    method: 'post'
  })
}

// 修改用户角色
export function allocRole(data) {
  return request({
    url: '/admin/role/update',
    method: 'post',
    data: data
  })
}
