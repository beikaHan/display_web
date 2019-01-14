import request from "../utils/request";

export async function getClassifyDisplayAll(params) {
  return request('/schoolDisplayBoardClassify/all', {
    method: 'POST',
    body: params,
  });
}

export async function getClassifyDisplay(params) {
  return request('/schoolDisplayBoardClassify/list', {
    method: 'POST',
    body: params,
  });
}

export async function addClassifyDisplayData(params) {
  return request('/schoolDisplayBoardClassify/add', {
    method: 'POST',
    body: params,
  });
}

export async function getClassifyDisplayItem(params) {
  return request('/schoolDisplayBoardClassify/get', {
    method: 'POST',
    body: params,
  });
}

export async function uptClassifyDisplayItem(params) {
  return request('/schoolDisplayBoardClassify/update', {
    method: 'POST',
    body: params,
  });
}
export async function delClassifyDisplay(params) {
  return request('/schoolDisplayBoardClassify/del', {
    method: 'POST',
    body: params,
  });
}

export async function getContentDisplay(params) {
  return request('/schoolDisplayBoard/list', {
    method: 'POST',
    body: params,
  });
}

export async function addContentDisplayData(params) {
  return request('/schoolDisplayBoard/add', {
    method: 'POST',
    body: params,
  });
}

export async function getContentDisplayItem(params) {
  return request('/schoolDisplayBoard/get', {
    method: 'POST',
    body: params,
  });
}

export async function uptContentDisplayItem(params) {
  return request('/schoolDisplayBoard/update', {
    method: 'POST',
    body: params,
  });
}
export async function delContentDisplay(params) {
  return request('/schoolDisplayBoard/del', {
    method: 'POST',
    body: params,
  });
}
