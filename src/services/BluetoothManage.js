import request from "../utils/request";

export async function getSchoolBluetooth(params) {
  return request('/schoolBluetooth/list', {
    method: 'POST',
    body: params,
  });
}

export async function addSchoolBluetoothData(params) {
  return request('/schoolBluetooth/add', {
    method: 'POST',
    body: params,
  });
}

export async function getSchoolBluetoothItem(params) {
  return request('/schoolBluetooth/get', {
    method: 'POST',
    body: params,
  });
}

export async function uptSchoolBluetoothItem(params) {
  return request('/schoolBluetooth/update', {
    method: 'POST',
    body: params,
  });
}
export async function delSchoolBluetooth(params) {
  return request('/schoolBluetooth/del', {
    method: 'POST',
    body: params,
  });
}
export async function getRecourseList(params) {
  return request('/common/all', {
    method: 'POST',
    body: params,
  });
}
export async function getBluetoothAll(params) {
  return request('/schoolBluetooth/all', {
    method: 'POST',
    body: params,
  });
}
