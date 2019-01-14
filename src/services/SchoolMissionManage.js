import request from "../utils/request";

export async function getSchoolMission(params) {
  return request('/schoolMission/list', {
    method: 'POST',
    body: params,
  });
}

export async function addSchoolMissionData(params) {
  return request('/schoolMission/add', {
    method: 'POST',
    body: params,
  });
}

export async function getSchoolMissionItem(params) {
  return request('/schoolMission/get', {
    method: 'POST',
    body: params,
  });
}

export async function uptSchoolMissionItem(params) {
  return request('/schoolMission/update', {
    method: 'POST',
    body: params,
  });
}
export async function delSchoolMission(params) {
  return request('/schoolMission/del', {
    method: 'POST',
    body: params,
  });
}
export async function getTitleAll(params) {
  return request('/schoolRank/all', {
    method: 'POST',
    body: params,
  });
}
export async function getSchoolMissionAll(params) {
  return request('/schoolMission/all', {
    method: 'POST',
    body: params,
  });
}
