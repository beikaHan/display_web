import { Button, notification } from 'antd';
import { setLoginOut } from './index';

export function validResult(result) {
  if (!result) {
    return false;
  }
  if (result.msg) {
    notification.error({
      message: result.err,
    });
    return false;
  }
  if (!result.data) {
    notification.error({
      message: result.err || '数据返回错误，请刷新',
    });
    return false;
  }
  if (result.data && result.data.status == -1) {
    notification.error({
      message: result.data.msg,
    });
    if (result.data.jsessionId == '') {
      setLoginOut();
      window.location.href = '/user';
    }
    return false;
    // throw new Error(result.data.status+"@#$%"+result.data.msg);
  }
  if (result.data && result.data.status != 0) {
    notification.error({
      message: result.data.msg,
    });
    return false;
    // throw new Error(result.data.status+"@#$%"+result.data.msg);
  }
  return true;
}
