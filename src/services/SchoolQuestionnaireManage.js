import request from "../utils/request";

export async function getSchoolQuestionnaire(params) {
  return request('/schoolQuestionnaire/list', {
    method: 'POST',
    body: params,
  });
}

export async function addSchoolQuestionnaireData(params) {
  return request('/schoolQuestionnaire/add', {
    method: 'POST',
    body: params,
  });
}

export async function getSchoolQuestionnaireItem(params) {
  return request('/schoolQuestionnaire/get', {
    method: 'POST',
    body: params,
  });
}

export async function uptSchoolQuestionnaireItem(params) {
  return request('/schoolQuestionnaire/update', {
    method: 'POST',
    body: params,
  });
}
export async function delSchoolQuestionnaire(params) {
  return request('/schoolQuestionnaire/del', {
    method: 'POST',
    body: params,
  });
}

export async function getResultData(params) {
  return request('/schoolQuestionnaire/result', {
    method: 'POST',
    body: params,
  });
}
export async function pushWX(params) {
  return request('/schoolQuestionnaire/push', {
    method: 'POST',
    body: params,
  });
}
