import { axios } from '@/utils/request'

const api = {
  list: '/user/list',
  valid: '/user/valid'
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
  return axios({
    url: api.valid,
    method: 'get',
    parameter: parameter
  })
}
