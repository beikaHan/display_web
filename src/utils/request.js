import fetch from 'dva/fetch';
import { notification } from 'antd';
import url from './ipconfig';
import {getCookie} from "../utils";
import { routerRedux } from 'dva/router';
import { canThrough } from './urlFilter';

let requestLockObjOne = {};
let requestLockObjTwo = {};

/**
 * 解锁
 * @param url
 * @param params
 */
function unlockRequest(url, params) {
  setTimeout(() => {
    if (requestLockObjOne[url + '_' + (params && params.body)]) {
      delete (requestLockObjOne[url + '_' + (params && params.body)]);
    }
  }, 300);
  delete (requestLockObjTwo[url + '_' + (params && params.body)]);
}

/**
 * 加锁
 * @param url
 * @param params
 */
function lockRequest(url, params) {
  if (requestLockObjOne[url + '_' + (params && params.body)] == undefined) {
    requestLockObjOne[url + '_' + (params && params.body)] = true;
    requestLockObjTwo[url + '_' + (params && params.body)] = true;
    return '0';
  } else if (requestLockObjOne[url + '_' + (params && params.body)] && requestLockObjTwo[url + '_' + (params && params.body)]) {
    return '1';
  } else {
    return '2';
  }
}

function checkStatus(response, url, params) {
  unlockRequest(url, params);

  if (response.status >= 200 && response.status <500) {
    return response;
  }
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: response.statusText,
  });
  const error = new Error(response.statusText);
  error.response = response;
  // throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
const baseURL = url.baseURL;

let headers = {
  // 'Accept': 'application/json',
  'Content-Type': getCookie() ? 'application/json' : 'application/x-www-form-urlencoded',
  'JSESSIONID': getCookie() ? getCookie() : null
};
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  switch (options.method.toLowerCase()) {
    case 'post':
      return post(url, options.body);
      break;
    case 'get':
      return get(url, options.body);
      break;
    default:
      return fetchActive(url, { ...options, header: headers });
  }
  return post(url, options.body);
}

function toQueryString(obj) {
  return obj ? Object.keys(obj).map(function(key) {
    var val = obj[key];
    if (Array.isArray(val)) {
      return val.sort().map(function(val2) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
      }).join('&');
    }

    return encodeURIComponent(key) + '=' + encodeURIComponent(val);
  }).join('&') : '';
}

function parseJSON(response) {
  return response.json();
}

export function fetchActive(url, options) {
  const fdStart = url.indexOf('http');
  if (fdStart != 0) {
    url = baseURL + url;
  }
  const lockRequestVal = lockRequest(url, options);
  if (lockRequestVal == '1') {
    console.log('连续请求拦截', url);

    // throw  new Error();
    return false;
  } else if (lockRequestVal == '2') {
    console.log('连续请求拦截', url);
    return false;
  }
  return fetch(url, { ...options, credentials: 'include', redirect: 'manual' })
    .then(data => checkStatus(data, url, options))
    .then(parseJSON)
    .then(parseErrorMessage)
    .then((data) => {
    
      return { data };
      // if (data.code == '44') {
      //   notification.error({
      //     message: `登录超时`,
      //     description: '登录超时，请您重新登录。',
      //   });
      //   setTimeout(() => {
      //     // setLoginOut();
      //     location.reload();
      //   }, 3000);
      // } else {
      //   return { data };
      // }
    })
    .catch((error) => {
      if (error.code) {
        notification.error({
          message: error.name,
          description: error.message,
        });
      }
      // if ('stack' in error && 'message' in error) {
      //   notification.error({
      //     message: `请求错误: ${url}`,
      //     description: error.message,
      //   });
      // }
      return error;
    });
}

export function post(url, data) {
  let body = new FormData();
  // if(!canThrough(url)){
  //   let idfyToken = getLoginToken();
  //   if(!data) data = {};
  //   data.idfyToken = idfyToken;
  // }
  for (let key in data) {
    body.append(key, data[key]);
  }
  headers = {
  // 'Accept': 'application/json',
  'Content-Type': getCookie() ? 'application/json' : 'application/x-www-form-urlencoded',
  'JSESSIONID': getCookie() ? getCookie() : null
};
  return fetchActive(url, { body: JSON.stringify(data), headers: headers, method: 'post' });
}

export function get(url, data) {
  // url += '?';
  // if(!canThrough(url)){
  //   let idfyToken = getLoginToken();
  //   if(!data) data = {};
  //   data.idfyToken = idfyToken;
  // }
  for (let key in data) {
    url += key + '=' + data[key] + '&';
  }
headers = {
  // 'Accept': 'application/json',
  'Content-Type': getCookie() ? 'application/json' : 'application/x-www-form-urlencoded',
  'JSESSIONID': getCookie() ? getCookie() : null
};
  return fetchActive(url, { headers: headers, method: 'get' });
}

export function put(url, options) {
  return fetchActive(url, { ...options, method: 'put' });
}

export function deleted(url, options) {
  return fetchActive(url, { ...options, method: 'deleted' });
}

function parseErrorMessage(result) {
  const { code } = result;
  if (code == '9999') {
    notification.error({
    message: result.msg,
  });
    // throw new Error(result.code + '@#$%' + result.msg);
  }
  return result;
}
