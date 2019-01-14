import {
  memberList, updateMemberList
} from '../../../services/PersonnelManage';
import moment from 'moment';
import {notification} from 'antd';
import {validResult} from "../../../utils/utilsValid";
import {
  getClassifyDisplayAll,
  addClassifyDisplayData, delClassifyDisplay,
  getClassifyDisplay,
  getClassifyDisplayItem,
  uptClassifyDisplayItem,
  addContentDisplayData, delContentDisplay,
  getContentDisplay,
  getContentDisplayItem,
  uptContentDisplayItem,
} from '../../../services/DisplayBoardManage';

export default {
  namespace: 'displayBoardManage',

  state: {
    loading: false,
    classifyDisplayItem: {},
    classifyDisplayData: {
      list: [],
      pagination: {},
    },
    contentDisplayItem: {},
    contentDisplayData: {
      list: [],
      pagination: {},
    },
    classifyDisplayAll: [],
    items: []
  },

  subscriptions: {
    setup({dispatch, history}) {
      /*dispatch({
        type: 'init',
      })*/
    },
  },

  effects: {
    *getClassifyDisplayAll({payload,callback}, {call, select, put}) {
      const result = yield call(getClassifyDisplayAll);
      if(!validResult(result)){return;}
      yield put({
        type: 'saveCP',
        payload: {classifyDisplayAll : result.data.list},
      });
    },
    * getClassifyDisplayList({payload,callback}, {call, select, put}) {
      let params = {
        rows: payload && payload.rows ?payload.rows : 10,
        page: payload && payload.page ?payload.page : 1,
        title: payload && payload.titleS ?payload.titleS : '',
      };
      const result = yield call(getClassifyDisplay, params);
      if(!validResult(result)){return;}
      let data = {}
      let pagination = {};

      pagination.current = result.data.current ? parseInt(result.data.current) : 1;
      pagination.pageSize = result.data.size ? parseInt(result.data.size) : 10;
      pagination.total = parseInt(result.data.total);
      data.pagination = pagination;
      data.list = result.data.list;
      yield put({
        type: 'saveClassifyDisplayData',
        payload: data,
      });
    },

    * addClassifyDisplayData({ payload, callback }, { call, select, put }) {
      let params = {
        ...payload.values,
      };
      console.log(params)
      const result = yield call(addClassifyDisplayData, params);
      if(!validResult(result)){return;}
      notification.success({
    message: '操作成功',
  });
      yield put({
        type: 'getClassifyDisplayList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },

    * getClassifyDisplayItem({ payload, callback }, { call, select, put }) {
      let params = {
        id: payload.id
      }
      const result = yield call(getClassifyDisplayItem, params);
      if(!validResult(result)){return;}

      yield put({
        type: 'saveCP',
        payload:{
          classifyDisplayItem: result.data.schoolDisplayBoardClassifyView
        },
      });
    },

    * uptClassifyDisplayData({ payload, callback }, { call, select, put }) {
      let params = {
        ...payload.values,
      }
      const result = yield call(uptClassifyDisplayItem, params);
      if(!validResult(result)){return;}

     notification.success({
    message: '操作成功',
  });
      yield put({
        type: 'getClassifyDisplayList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },

    * delClassifyDisplayData({payload,callback}, {call, select, put}) {
      console.log(payload)
      let params = {
        ids: payload && payload.ids ?payload.ids : []
      };
      const result = yield call(delClassifyDisplay, params);
      if(!validResult(result)){return;}
      notification.success({
    message: '操作成功',
  });
      yield put({
        type: 'getClassifyDisplayList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },

    * getContentDisplayList({payload,callback}, {call, select, put}) {
      let params = {
        rows: payload && payload.rows ?payload.rows : 10,
        page: payload && payload.page ?payload.page : 1,
        title: payload && payload.titleS ?payload.titleS : '',
        classifyId: payload && payload.classifyIdS ?payload.classifyIdS : '',
      };
      const result = yield call(getContentDisplay, params);
      if(!validResult(result)){return;}
      let data = {}
      let pagination = {};

      pagination.current = result.data.current ? parseInt(result.data.current) : 1;
      pagination.pageSize = result.data.size ? parseInt(result.data.size) : 10;
      pagination.total = parseInt(result.data.total);
      data.pagination = pagination;
      data.list = result.data.list;

      yield put({
        type: 'saveContentDisplayData',
        payload: data,
      });
    },

    * addContentDisplayData({ payload, callback }, { call, select, put }) {
      let params = {
        ...payload.values,
      };
      console.log(params)
      const result = yield call(addContentDisplayData, params);
      if(!validResult(result)){return;}
      notification.success({
    message: '操作成功',
  });
      yield put({
        type: 'getContentDisplayList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },

    * getContentDisplayItem({ payload, callback }, { call, select, put }) {
      let params = {
        id: payload.id
      }
      const result = yield call(getContentDisplayItem, params);
      if(!validResult(result)){return;}

      for(let i=0;i<result.data.items.length;i++){
        result.data.items[i].key = [i]
      }
      yield put({
        type: 'saveCP',
        payload:{
          contentDisplayItem: result.data.schoolDisplayBoardView,
          items: result.data.items
        },
      });
      if(callback)callback(result.data.items)
    },

    * uptContentDisplayData({ payload, callback }, { call, select, put }) {
      let params = {
        ...payload.values,
      }
      const result = yield call(uptContentDisplayItem, params);
      if(!validResult(result)){return;}

      notification.success({
    message: '操作成功',
  });
      yield put({
        type: 'getContentDisplayList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },

    * delContentDisplayData({payload,callback}, {call, select, put}) {
      console.log(payload)
      let params = {
        ids: payload && payload.ids ?payload.ids : []
      };
      const result = yield call(delContentDisplay, params);
      if(!validResult(result)){return;}
      notification.success({
    message: '操作成功',
  });
      yield put({
        type: 'getContentDisplayList',
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
    saveClassifyDisplayData(state, action) {
      return {
        ...state,
        classifyDisplayData: action.payload,
      };
    },

    saveContentDisplayData(state, action) {
      return {
        ...state,
        contentDisplayData: action.payload,
      };
    },
  },
}
