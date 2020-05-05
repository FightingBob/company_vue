import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/vue-element-admin/routes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/vue-element-admin/roles',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/vue-element-admin/role',
    method: 'post',
    data
  })
}

// 修改角色
export function updateRole(id, data) {
  return request({
    url: `/role/${id}`,
    method: 'post',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: '/role/delete',
    method: 'post',
    params: id
  })
}

// 查询角色列表
export function fetchList(params) {
  return request({
    url: '/role/list',
    method: 'get',
    params
  })
}

// 添加角色
export function createRole(data) {
  return request({
    url: '/role/create',
    method: 'post',
    data: data
  })
}

// 修改角色状态
export function updateStatus(id, params) {
  return request({
    url: `/role/updateStatus/${id}`,
    method: 'post',
    params
  })
}
