import request from "../utils/request";

export async function getSchoolRank(params) {
  return request('/schoolRank/list', {
    method: 'POST',
    body: params,
  });
}

export async function addSchoolRankData(params) {
  return request('/schoolRank/save', {
    method: 'POST',
    body: params,
  });
}

export async function getSchoolRankItem(params) {
  return request('/schoolRank/get', {
    method: 'POST',
    body: params,
  });
}

export async function uptSchoolRankItem(params) {
  return request('/schoolRank/update', {
    method: 'POST',
    body: params,
  });
}
export async function delSchoolRank(params) {
  return request('/schoolRank/del', {
    method: 'POST',
    body: params,
  });
}

export async function getSchoolRankAll(params) {
  return request('/schoolRank/all', {
    method: 'POST',
    body: params,
  });
}
