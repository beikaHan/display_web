import {
  addScoreConfigData, delScoreConfig,
  getScoreConfig, getScoreConfigItem, uptScoreConfigItem,
} from '../../../services/ScoreConfigManage';
import moment from 'moment';
import {notification} from 'antd';
import {validResult} from "../../../utils/utilsValid";

export default {
  namespace: 'fractionalRule',

  state: {
    loading: false,
    scoreConfig: {}
  },

  subscriptions: {
    setup({dispatch, history}) {
      /*dispatch({
        type: 'init',
      })*/
    },
  },

  effects: {
    * getScoreConfigItem({payload, callback}, {call, select, put}) {
      const result = yield call(getScoreConfigItem, {});
      if (!validResult(result)) {
        return;
      }
      yield put({
        type: 'saveCP',
        payload: {scoreConfig: result.data.scoreConfig},
      });
    },

    * addScoreConfigData({payload, callback}, {call, select, put}) {
      let params = {
        ...payload.values,
      };
      console.log(params)
      const result = yield call(uptScoreConfigItem, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getScoreConfigItem',

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
    saveScoreConfigData(state, action) {
      return {
        ...state,
        scoreConfigData: action.payload,
      };
    },
  },
}
