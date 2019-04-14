import request from '../utils/request';

export async function getClassifyAll(params) {
  return request('/schoolMaterialClassify/all', {
    method: 'POST',
    body: params,
  });
}

export async function getClassify(params) {
  return request('/schoolMaterialClassify/list', {
    method: 'POST',
    body: params,
  });
}

export async function addClassifyData(params) {
  return request('/schoolMaterialClassify/add', {
    method: 'POST',
    body: params,
  });
}

export async function getClassifyItem(params) {
  return request('/schoolMaterialClassify/get', {
    method: 'POST',
    body: params,
  });
}

export async function uptClassifyItem(params) {
  return request('/schoolMaterialClassify/update', {
    method: 'POST',
    body: params,
  });
}
export async function delClassify(params) {
  return request('/schoolMaterialClassify/del', {
    method: 'POST',
    body: params,
  });
}

export async function getSchoolMaterialAll(params) {
  return request('/schoolMaterial/all', {
    method: 'POST',
    body: params,
  });
}

export async function getSchoolMaterial(params) {
  return request('/schoolMaterial/list', {
    method: 'POST',
    body: params,
  });
}

export async function addSchoolMaterialData(params) {
  return request('/schoolMaterial/add', {
    method: 'POST',
    body: params,
  });
}

export async function getSchoolMaterialItem(params) {
  return request('/schoolMaterial/get', {
    method: 'POST',
    body: params,
  });
}

export async function uptSchoolMaterialItem(params) {
  return request('/schoolMaterial/update', {
    method: 'POST',
    body: params,
  });
}
export async function delSchoolMaterial(params) {
  return request('/schoolMaterial/del', {
    method: 'POST',
    body: params,
  });
}
