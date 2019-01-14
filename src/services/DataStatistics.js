import request from "../utils/request";

export async function getData(params) {
  return request('/schoolData/data/collect/get', {
    method: 'POST',
    body: params,
  });
}

export async function getUserData(params) {
  return request('/schoolData/user/collect/get', {
    method: 'POST',
    body: params,
  });
}

export async function getClassDataAll(params) {
  return request('/schoolClass/all', {
    method: 'POST',
    body: params,
  });
}