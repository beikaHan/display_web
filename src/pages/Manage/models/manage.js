import moment from 'moment';
import { notification } from 'antd';
import { validResult } from '../../../utils/utilsValid';
import {
  getSchool,
  addSchoolData,
  getSchoolItem,
  uptSchoolItem,
  delSchool,
  downloadQrcode,
  getChangeSchool,
  getTheme,
  uptSchoolTheme,
} from '../../../services/api';
import { setSchoolInfo, getSchoolInfo } from '@/utils/index';

export default {
  namespace: 'manage',

  state: {
    loading: false,
    manageData: {
      list: [],
      pagination: {},
    },
    schoolItem: {},
    themeData: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      /*dispatch({
        type: 'init',
      })*/
    },
  },

  effects: {
    *getSchoolList({ payload, callback }, { call, select, put }) {
      let params = {
        rows: payload && payload.rows ? payload.rows : 10,
        page: payload && payload.page ? payload.page : 1,
        title: payload && payload.titleS ? payload.titleS : '',
      };
      const result = yield call(getSchool, params);
      if (!validResult(result)) {
        return;
      }
      let data = {};
      let pagination = {};

      pagination.current = result.data.current ? parseInt(result.data.current) : 1;
      pagination.pageSize = result.data.size ? parseInt(result.data.size) : 10;
      pagination.total = parseInt(result.data.total);
      data.pagination = pagination;
      data.list = result.data.list;
      yield put({
        type: 'saveSchoolData',
        payload: data,
      });
    },

    *addSchoolData({ payload, callback }, { call, select, put }) {
      let params = {
        ...payload.values,
      };
      const result = yield call(addSchoolData, params);
      if (!validResult(result)) {
        return;
      }
      const schoolS = yield call(getSchool, {});
      validResult(schoolS);
      if (!getSchoolInfo() || getSchoolInfo().length == 0) {
        let school = {
          schoolId: schoolS.data.list[0].id,
        };
        const changeSchool = yield call(getChangeSchool, school);
        validResult(changeSchool);
        location.reload();
      }
      setSchoolInfo(schoolS.data.list);
      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getSchoolList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },

    *getSchoolItem({ payload, callback }, { call, select, put }) {
      let params = {
        id: payload.id,
      };
      const result = yield call(getSchoolItem, params);
      if (!validResult(result)) {
        return;
      }

      yield put({
        type: 'saveCP',
        payload: {
          schoolItem: result.data.school,
        },
      });
    },
    *uptSchoolData({ payload, callback }, { call, select, put }) {
      let params = {
        ...payload.values,
      };
      const result = yield call(uptSchoolItem, params);
      if (!validResult(result)) {
        return;
      }

      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getSchoolList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },
    *delSchoolData({ payload, callback }, { call, select, put }) {
      console.log(payload);
      let params = {
        ids: payload && payload.ids ? payload.ids : [],
      };
      const result = yield call(delSchool, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getSchoolList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },

    *downloadQrcode({ payload, callback }, { call, select, put }) {
      let params = {
        id: payload && payload.schoolId ? payload.schoolId : 0,
      };
      const result = yield call(downloadQrcode, params);
    },

    *themeData({ payload, callback }, { call, select, put }) {
      let params = {};
      const result = yield call(getTheme, params);
      if (!validResult(result)) {
        return;
      }
      yield put({
        type: 'saveCP',
        payload: {
          schoolItem: result.data.list,
        },
      });
    },

    *uptSchoolTheme({ payload, callback }, { call, select, put }) {
      let params = {
        ...payload.values,
      };
      const result = yield call(uptSchoolTheme, params);
      if (!validResult(result)) {
        return;
      }

      notification.success({
        message: '主题变更成功',
      });
      yield put({
        type: 'getSchoolList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },
  },

  reducers: {
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    saveCP(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    saveSchoolData(state, action) {
      return {
        ...state,
        manageData: action.payload,
      };
    },
  },
};
