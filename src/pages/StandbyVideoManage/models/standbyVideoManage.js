import {
  addStandbyVideoData,
  delStandbyVideo,
  getStandbyVideo,
  getStandbyVideoItem,
  uptStandbyVideoItem,
} from '../../../services/StandbyVideoManage';
import moment from 'moment';
import { notification } from 'antd';
import { validResult } from '../../../utils/utilsValid';
import { getSchoolMaterialAll } from '../../../services/TeachingManage';

export default {
  namespace: 'standbyVideoManage',

  state: {
    loading: false,
    standbyVideoItem: {},
    standbyVideoData: {
      list: [],
      pagination: {},
    },
    videoAllData: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      /*dispatch({
        type: 'init',
      })*/
    },
  },

  effects: {
    *getStandbyVideoList({ payload, callback }, { call, select, put }) {
      let params = {
        rows: payload && payload.rows ? payload.rows : 10,
        page: payload && payload.page ? payload.page : 1,
        title: payload && payload.titleS ? payload.titleS : '',
      };
      const result = yield call(getStandbyVideo, params);
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
        type: 'saveStandbyVideoData',
        payload: data,
      });
    },

    *addStandbyVideoData({ payload, callback }, { call, select, put }) {
      let params = {
        ...payload.values,
      };
      console.log(params);
      const result = yield call(addStandbyVideoData, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getStandbyVideoList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },

    *getStandbyVideoItem({ payload, callback }, { call, select, put }) {
      let params = {
        id: payload.id,
      };
      const result = yield call(getStandbyVideoItem, params);
      if (!validResult(result)) {
        return;
      }

      yield put({
        type: 'saveCP',
        payload: {
          standbyVideoItem: result.data.schoolStandbyVideo,
        },
      });
      if (callback) callback(result.data.schoolStandbyVideo);
    },

    *uptStandbyVideoData({ payload, callback }, { call, select, put }) {
      let params = {
        ...payload.values,
      };
      const result = yield call(uptStandbyVideoItem, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });

      yield put({
        type: 'getStandbyVideoList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },

    *delStandbyVideoData({ payload, callback }, { call, select, put }) {
      console.log(payload);
      let params = {
        ids: payload && payload.ids ? payload.ids : [],
      };
      const result = yield call(delStandbyVideo, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getStandbyVideoList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },
    *getVideoAll({ payload, callback }, { call, select, put }) {
      let params = {
        type: 1,
      };
      const result = yield call(getSchoolMaterialAll, params);
      if (!validResult(result)) {
        return;
      }

      yield put({
        type: 'saveCP',
        payload: {
          videoAllData: result.data.list,
        },
      });
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
    saveStandbyVideoData(state, action) {
      return {
        ...state,
        standbyVideoData: action.payload,
      };
    },
  },
};
