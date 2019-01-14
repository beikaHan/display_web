import {
  queryUsers, queryCurrent
} from '../services/user';
import { getScoreConfigItem, 
} from '../services/ScoreConfigManage';
import {validResult} from '@/utils/utilsValid';
import {notification} from 'antd';
export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      // const response = yield call(queryUsers);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
    },
    *fetchCurrent(_, { call, put }) {
      // const response = yield call(queryCurrent);
      // yield put({
      //   type: 'saveCurrentUser',
      //   payload: response,
      // });
    },
     * getScoreConfigItem({payload, callback}, {call, select, put}) {
      const result = yield call(getScoreConfigItem, {});
      if (!validResult(result)) {
        return;
      }
      if(result.data.scoreConfig && result.data.scoreConfig.id){
         
      }else{
        notification.warning({
          message: '请先设置分数规则',
        });
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
