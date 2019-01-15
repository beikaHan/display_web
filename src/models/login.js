import { routerRedux, redirect } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin, getFakeCaptcha, getSchool, getChangeSchool } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { validResult } from '@/utils/utilsValid';
import { notification } from 'antd';
import {
  setLoginIn,
  setLoginOut,
  getCookie,
  setSchoolInfo,
  setRole,
  removeRole,
  setUserName,
  getUserName,
  setschoolId,
  setSchoolTitle,
} from '@/utils/index';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      setLoginOut();
      const response = yield call(fakeAccountLogin, payload);
      if (response.data.status == 0) {
        yield put({
          type: 'changeLoginStatus',
          payload: response.data,
        });
        validResult(response);
        setLoginIn(response.data.jsessionId);
        setSchoolTitle(response.data.user.schoolTitle);
        setUserName(response.data.user.name);

        let params = {};
        const result = yield call(getSchool, params);
        if (!validResult(result)) {
          return;
        }
        setSchoolInfo(result.data.list);
        for (let i = 0; i < response.data.user.roles.length; i++) {
          if (response.data.user.roles[i].name === 'ROLE_admin') {
            if (result.data.list && result.data.list.length > 0) {
              let school = {
                schoolId: result.data.list[0].id,
              };
              const changeSchool = yield call(getChangeSchool, school);
              validResult(changeSchool);
              setschoolId(changeSchool.data.school.id);
            }

            setRole(response.data.user.roles[i].name);
            yield put(routerRedux.push('/list'));
            return;
          }
        }
        removeRole();
        yield put(routerRedux.push('/personnelManage'));
      } else {
        notification.error({
          message: '用户名或密码错误',
        });
        yield put(routerRedux.replace(redirect || '/'));
      }

      // Login successfully
      // if (response.status === 'ok') {
      //   reloadAuthorized();
      //   const urlParams = new URL(window.location.href);
      //   const params = getPageQuery();
      //   let { redirect } = params;
      //   if (redirect) {
      //     const redirectUrlParams = new URL(redirect);
      //     if (redirectUrlParams.origin === urlParams.origin) {
      //       redirect = redirect.substr(urlParams.origin.length);
      //       if (redirect.match(/^\/.*#/)) {
      //         redirect = redirect.substr(redirect.indexOf('#') + 1);
      //       }
      //     } else {
      //       window.location.href = redirect;
      //       return;
      //     }
      //   }
      //   yield put(routerRedux.replace(redirect || '/'));
      // }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put }) {
      setLoginOut();
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
          user: { userName: '' },
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      console.log(payload);
      setAuthority(payload.user.userName);
      return {
        ...state,
        status: payload.status,
        jsessionId: payload.jsessionId,
      };
    },
  },
};
