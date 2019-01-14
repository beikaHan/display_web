import {
  memberList, updateMemberList
} from '../../../services/PersonnelManage';
import moment from 'moment';
import {notification} from 'antd';
import {validResult} from "../../../utils/utilsValid";
import {
  addSchoolQuestionnaireData, delSchoolQuestionnaire,
  getSchoolQuestionnaire,
  getSchoolQuestionnaireItem,
  uptSchoolQuestionnaireItem, getResultData, pushWX
} from '../../../services/SchoolQuestionnaireManage';

export default {
  namespace: 'questionnaireInvestigation',

  state: {
    loading: false,
    schoolQuestionnaireItem: {},
    schoolQuestionnaireData: {
      list: [],
      pagination: {},
    },
    items: [],
    resultDataList: {},
    resultDataListItems: [],
    joinUserCount: 0,
  },

  subscriptions: {
    setup({dispatch, history}) {
      /*dispatch({
        type: 'init',
      })*/
    },
  },

  effects: {
    * getSchoolQuestionnaireList({payload, callback}, {call, select, put}) {
      let params = {
        rows: payload && payload.rows ? payload.rows : 10,
        page: payload && payload.page ? payload.page : 1,
        title: payload && payload.titleS ? payload.titleS : '',
      };
      const result = yield call(getSchoolQuestionnaire, params);
      if (!validResult(result)) {
        return;
      }
      let data = {}
      let pagination = {};

      pagination.current = result.data.current ? parseInt(result.data.current) : 1;
      pagination.pageSize = result.data.size ? parseInt(result.data.size) : 10;
      pagination.total = parseInt(result.data.total);
      data.pagination = pagination;
      data.list = result.data.list;
      yield put({
        type: 'saveSchoolQuestionnaireData',
        payload: data,
      });
    },

    * addSchoolQuestionnaireData({payload, callback}, {call, select, put}) {
      let params = {
        ...payload.values,
      };
      console.log(params)
      const result = yield call(addSchoolQuestionnaireData, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getSchoolQuestionnaireList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },

    * getSchoolQuestionnaireItem({payload, callback}, {call, select, put}) {
      let params = {
        id: payload.id
      }
      const result = yield call(getSchoolQuestionnaireItem, params);
      if (!validResult(result)) {
        return;
      }
      for (let i = 0; i < result.data.items.length; i++) {
        result.data.items[i].key = [i]
      }
      yield put({
        type: 'saveCP',
        payload: {
          schoolQuestionnaireItem: result.data.schoolQuestionnaireView,
          items: result.data.items
        },
      });
      if (callback) callback(result.data.items)
    },

    * uptSchoolQuestionnaireData({payload, callback}, {call, select, put}) {
      let params = {
        ...payload.values,
      }
      const result = yield call(uptSchoolQuestionnaireItem, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getSchoolQuestionnaireList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },

    * delSchoolQuestionnaireData({payload, callback}, {call, select, put}) {
      console.log(payload)
      let params = {
        ids: payload && payload.ids ? payload.ids : []
      };
      const result = yield call(delSchoolQuestionnaire, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getSchoolQuestionnaireList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },

    * resultData({payload, callback}, {call, select, put}) {
      console.log(payload)
      let params = {
        id: payload && payload.id ? payload.id : ''
      };
      const result = yield call(getResultData, params);
      if (!validResult(result)) {
        return;
      }
      yield put({
        type: 'saveCP',
        payload: {
          resultDataList: result.data.schoolQuestionnaireView,
          resultDataListItems: result.data.Items,
          joinUserCount: result.data.joinUserCount
        },
      });
      if (callback) callback();
    },

    * pushWX({payload, callback}, {call, select, put}) {
      console.log(payload)
      let params = {
        id: payload && payload.id ? payload.id : ''
      };
      const result = yield call(pushWX, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '推送成功',
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
    saveSchoolQuestionnaireData(state, action) {
      return {
        ...state,
        schoolQuestionnaireData: action.payload,
      };
    },
  },
}
