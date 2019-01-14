import request from "../utils/request";

export async function getScoreConfig(params) {
  return request('/scoreConfig/list', {
    method: 'POST',
    body: params,
  });
}

export async function addScoreConfigData(params) {
  return request('/scoreConfig/add', {
    method: 'POST',
    body: params,
  });
}

export async function getScoreConfigItem(params) {
  return request('/scoreConfig/get', {
    method: 'POST',
    body: params,
  });
}

export async function uptScoreConfigItem(params) {
  return request('/scoreConfig/update', {
    method: 'POST',
    body: params,
  });
}
export async function delScoreConfig(params) {
  return request('/scoreConfig/del', {
    method: 'POST',
    body: params,
  });
}
