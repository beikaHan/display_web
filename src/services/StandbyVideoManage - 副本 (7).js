import request from "../utils/request";

export async function getStandbyVideo(params) {
  return request('/schoolStandbyVideo/list', {
    method: 'POST',
    body: params,
  });
}

export async function addStandbyVideoData(params) {
  return request('/schoolStandbyVideo/add', {
    method: 'POST',
    body: params,
  });
}

export async function getStandbyVideoItem(params) {
  return request('/schoolStandbyVideo/get', {
    method: 'POST',
    body: params,
  });
}

export async function uptStandbyVideoItem(params) {
  return request('/schoolStandbyVideo/update', {
    method: 'POST',
    body: params,
  });
}
export async function delStandbyVideo(params) {
  return request('/schoolStandbyVideo/del', {
    method: 'POST',
    body: params,
  });
}
