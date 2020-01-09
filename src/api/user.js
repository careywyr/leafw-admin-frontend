import { axios } from '@/utils/request'

const api = {
  list: '/user/list',
  valid: '/user/valid',
  user: '/user'
}

export default api

export function queryUserList (parameter, pageNum, pageSize) {
  return axios({
    url: api.list + '/' + pageSize + '/' + pageNum,
    method: 'post',
    data: parameter
  })
}

export function changeUserStatus (parameter) {
  console.log(parameter)
  return axios({
    url: api.valid,
    method: 'get',
    params: parameter
  })
}

export function delUser (parameter) {
  return axios({
    url: api.user,
    method: 'delete',
    params: parameter
  })
}

export function saveUser (parameter) {
  return axios({
    url: api.user,
    method: 'post',
    data: parameter
  })
}

export function updateUser (parameter) {
  return axios({
    url: api.user,
    method: 'put',
    data: parameter
  })
}
