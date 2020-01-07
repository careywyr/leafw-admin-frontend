import { axios } from '@/utils/request'

const api = {
  list: '/org/list',
  org: '/org'
}

export default api

export function getOrgList (parameter, pageNum, pageSize) {
  return axios({
    url: api.list + '/' + pageSize + '/' + pageNum,
    method: 'get',
    params: parameter
  })
}

export function deleteOrg (parameter) {
  return axios({
    url: api.org + '/' + parameter,
    method: 'delete'
  })
}

export function saveOrg (parameter) {
  return axios({
    url: api.org,
    method: 'post',
    data: parameter
  })
}

export function updateOrg (parameter) {
  return axios({
    url: api.org,
    method: 'put',
    params: parameter
  })
}
