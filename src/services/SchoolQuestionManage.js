import request from "../utils/request";

export async function getSchoolQuestionTopicAll(params) {
  return request('/schoolQuestionTopic/all', {
    method: 'POST',
    body: params,
  });
}

export async function getSchoolQuestionTopic(params) {
  return request('/schoolQuestionTopic/list', {
    method: 'POST',
    body: params,
  });
}

export async function addSchoolQuestionTopicData(params) {
  return request('/schoolQuestionTopic/add', {
    method: 'POST',
    body: params,
  });
}

export async function getSchoolQuestionTopicItem(params) {
  return request('/schoolQuestionTopic/get', {
    method: 'POST',
    body: params,
  });
}

export async function uptSchoolQuestionTopicItem(params) {
  return request('/schoolQuestionTopic/update', {
    method: 'POST',
    body: params,
  });
}
export async function delSchoolQuestionTopic(params) {
  return request('/schoolQuestionTopic/del', {
    method: 'POST',
    body: params,
  });
}

export async function getSchoolQuestionBank(params) {
  return request('/schoolQuestionBank/list', {
    method: 'POST',
    body: params,
  });
}

export async function addSchoolQuestionBankData(params) {
  return request('/schoolQuestionBank/add', {
    method: 'POST',
    body: params,
  });
}
export async function getSchoolQuestionBankAll(params) {
  return request('/schoolQuestionBank/all', {
    method: 'POST',
    body: params,
  });
}
export async function getSchoolQuestionBankItem(params) {
  return request('/schoolQuestionBank/get', {
    method: 'POST',
    body: params,
  });
}

export async function uptSchoolQuestionBankItem(params) {
  return request('/schoolQuestionBank/update', {
    method: 'POST',
    body: params,
  });
}
export async function delSchoolQuestionBank(params) {
  return request('/schoolQuestionBank/del', {
    method: 'POST',
    body: params,
  });
}

export async function getSchoolCustomTest(params) {
  return request('/schoolCustomTest/list', {
    method: 'POST',
    body: params,
  });
}

export async function addSchoolCustomTestData(params) {
  return request('/schoolCustomTest/add', {
    method: 'POST',
    body: params,
  });
}

export async function getSchoolCustomTestItem(params) {
  return request('/schoolCustomTest/get', {
    method: 'POST',
    body: params,
  });
}

export async function uptSchoolCustomTestItem(params) {
  return request('/schoolCustomTest/update', {
    method: 'POST',
    body: params,
  });
}
export async function delSchoolCustomTest(params) {
  return request('/schoolCustomTest/del', {
    method: 'POST',
    body: params,
  });
}

export async function getSchoolCustomTestConfigo(params) {
  return request('/schoolCustomTestConfig/list', {
    method: 'POST',
    body: params,
  });
}

export async function addSchoolCustomTestConfigoData(params) {
  return request('/schoolCustomTestConfig/add', {
    method: 'POST',
    body: params,
  });
}

export async function getSchoolCustomTestConfigoItem(params) {
  return request('/schoolCustomTestConfig/get', {
    method: 'POST',
    body: params,
  });
}

export async function uptSchoolCustomTestConfigoItem(params) {
  return request('/schoolCustomTestConfig/save', {
    method: 'POST',
    body: params,
  });
}
export async function delSchoolCustomTestConfigo(params) {
  return request('/schoolCustomTestConfig/del', {
    method: 'POST',
    body: params,
  });
}

export async function getSchoolCustomGenerateData(params) {
  return request('/schoolCustomTest/auto/generate', {
    method: 'POST',
    body: params,
  });
}