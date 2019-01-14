import {
  addSchoolGuideData, delSchoolGuide,
  getSchoolGuide, getSchoolGuideItem, uptSchoolGuideItem,
} from '../../../services/SchoolGuideManage';
import moment from 'moment';
import {notification} from 'antd';
import {validResult} from "../../../utils/utilsValid";

export default {
  namespace: 'guideManage',

  state: {
    loading: false,
    schoolGuideItem: {},
    schoolGuideData: {
      list: [],
      pagination: {},
    },
  },

  subscriptions: {
    setup({dispatch, history}) {
      /*dispatch({
        type: 'init',
      })*/
    },
  },

  effects: {
    * getSchoolGuideList({payload,callback}, {call, select, put}) {
      let params = {
        rows: payload && payload.rows ?payload.rows : 10,
        page: payload && payload.page ?payload.page : 1,
        title: payload && payload.titleS ?payload.titleS : '',
      };
      const result = yield call(getSchoolGuide, params);
      if(!validResult(result)){return;}
      let data = {}
      let pagination = {};

      pagination.current = result.data.current ? parseInt(result.data.current) : 1;
      pagination.pageSize = result.data.size ? parseInt(result.data.size) : 10;
      pagination.total = parseInt(result.data.total);
      data.pagination = pagination;
      data.list = result.data.list;
      yield put({
        type: 'saveSchoolGuideData',
        payload: data,
      });
    },

    * addSchoolGuideData({ payload, callback }, { call, select, put }) {
      let params = {
        ...payload.values,
      };
      console.log(params)
      const result = yield call(addSchoolGuideData, params);
      if(!validResult(result)){return;}
      notification.success({
    message: '操作成功',
  });
      yield put({
        type: 'getSchoolGuideList',
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
    saveSchoolGuideData(state, action) {
      return {
        ...state,
        schoolGuideData: action.payload,
      };
    },
  },
}
