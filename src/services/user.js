import request from '@/utils/request';

export async function queryUsers(params) {
  return request('/api/users');
}

export async function queryCurrent(params) {
  return request('/api/currentUser');
}
//
// export async function query() {
//   return request('/api/users');
// }
//
// export async function queryCurrent() {
//   return request('/api/currentUser');
// }
