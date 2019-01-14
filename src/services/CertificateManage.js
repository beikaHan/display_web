import request from "../utils/request";

export async function getCertificateItem(params) {
  return request('/schoolCertificate/get', {
    method: 'POST',
    body: params,
  });
}

export async function addCertificateData(params) {
  return request('/schoolCertificate/save', {
    method: 'POST',
    body: params,
  });
}

