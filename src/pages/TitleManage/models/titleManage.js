import {
  addSchoolRankData, delSchoolRank,
  getSchoolRank, getSchoolRankItem, uptSchoolRankItem, getSchoolRankAll
} from '../../../services/SchoolRankManage';
import moment from 'moment';
import {notification} from 'antd';
import {validResult} from "../../../utils/utilsValid";

export default {
  namespace: 'titleManage',

  state: {
    loading: false,
    schoolRankItem: {},
    schoolRankAll: []
  },

  subscriptions: {
    setup({dispatch, history}) {
      /*dispatch({
        type: 'init',
      })*/
    },
  },

  effects: {
    * getSchoolRankList({payload, callback}, {call, select, put}) {
      const result = yield call(getSchoolRankAll);
      if (!validResult(result)) {
        return;
      }
      for (let i = 0; i < result.data.list.length; i++) {
        result.data.list[i].key = i
      }
      yield put({
        type: 'saveCP',
        payload: {schoolRankAll: result.data.list},
      });
      if (callback) callback(result.data.list);
    },

    * addSchoolRankData({payload, callback}, {call, select, put}) {
      let params = {
        items: payload.items
      };
      console.log(params)
      const result = yield call(addSchoolRankData, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getSchoolRankList',
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
    saveSchoolRankData(state, action) {
      return {
        ...state,
        schoolRankData: action.payload,
      };
    },
  },
}
