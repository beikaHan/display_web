import request from "../utils/request";

export async function getTeacher(params) {
  return request('/schoolTeacher/list', {
    method: 'POST',
    body: params,
  });
}

export async function addTeacherData(params) {
  return request('/schoolTeacher/add', {
    method: 'POST',
    body: params,
  });
}

export async function getTeacherItem(params) {
  return request('/schoolTeacher/get', {
    method: 'POST',
    body: params,
  });
}

export async function uptTeacherItem(params) {
  return request('/schoolTeacher/update', {
    method: 'POST',
    body: params,
  });
}
export async function delTeacher(params) {
  return request('/schoolTeacher/del', {
    method: 'POST',
    body: params,
  });
}

export async function getStudent(params) {
  return request('/schoolStudent/list', {
    method: 'POST',
    body: params,
  });
}

export async function addStudentData(params) {
  return request('/schoolStudent/add', {
    method: 'POST',
    body: params,
  });
}

export async function getStudentItem(params) {
  return request('/schoolStudent/get', {
    method: 'POST',
    body: params,
  });
}

export async function uptStudentItem(params) {
  return request('/schoolStudent/update', {
    method: 'POST',
    body: params,
  });
}
export async function delStudent(params) {
  return request('/schoolStudent/del', {
    method: 'POST',
    body: params,
  });
}

export async function getClassAll() {
  return request('/schoolClass/all', {
    method: 'POST',  });
}

export async function getClass(params) {
  return request('/schoolClass/list', {
    method: 'POST',
    body: params,
  });
}

export async function addClassData(params) {
  return request('/schoolClass/add', {
    method: 'POST',
    body: params,
  });
}

export async function getClassItem(params) {
  return request('/schoolClass/get', {
    method: 'POST',
    body: params,
  });
}

export async function uptClassItem(params) {
  return request('/schoolClass/update', {
    method: 'POST',
    body: params,
  });
}
export async function delClass(params) {
  return request('/schoolClass/del', {
    method: 'POST',
    body: params,
  });
}
export async function getTeacherDetail(params) {
  return request('/exhibitionRecord/list', {
    method: 'POST',
    body: params,
  });
}
