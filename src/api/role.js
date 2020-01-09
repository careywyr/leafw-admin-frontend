import { axios } from '@/utils/request'

const api = {
  list: '/role/list',
  all: '/role/list/all',
  role: '/role',
  allPermission: '/permission/all'
}

export default api

export function queryRoleList (parameter, pageNum, pageSize) {
  return axios({
    url: api.list + '/' + pageSize + '/' + pageNum,
    method: 'post',
    data: parameter
  })
}

export function deleteRole (parameter) {
  return axios({
    url: api.role + '/' + parameter,
    method: 'delete'
  })
}

export function saveRole (parameter) {
  return axios({
    url: api.role,
    method: 'post',
    data: parameter
  })
}

export function updateRole (parameter) {
  return axios({
    url: api.role,
    method: 'put',
    params: parameter
  })
}

export function getRoleAll (parameter) {
  return axios({
    url: api.all,
    method: 'get'
  })
}

export function getPermissionAll (parameter) {
  return axios({
    url: api.allPermission,
    method: 'get'
  })
}
