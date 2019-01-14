import request from "../utils/request";

export async function memberList(params) {
  return request('/PcManageServer/member/memberList/index.json', {
    method: 'POST',
    body:params
  });
}

export async function updateMemberList(params) {
  return request('/PcManageServer/member/update.json', {
    method: 'GET',
    body:params
  });
}

