import request from "../utils/request";

export async function getSchoolGuide(params) {
  return request('/schoolGuide/list', {
    method: 'POST',
    body: params,
  });
}

export async function addSchoolGuideData(params) {
  return request('/schoolGuide/add', {
    method: 'POST',
    body: params,
  });
}
