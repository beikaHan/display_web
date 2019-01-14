import {
  getUserData, getData, getClassDataAll
} from '../../../services/DataStatistics';
import moment from 'moment';
import {notification} from 'antd';
import {validResult} from "../../../utils/utilsValid";

export default {
  namespace: 'dataStatistics',

  state: {
    loading: false,
    visitData: {},
    classDataAll: []
  },

  subscriptions: {
    setup({dispatch, history}) {
      /*dispatch({
        type: 'init',
      })*/
    },
  },

  effects: {
    * getClassDataAll({payload, callback}, {call, select, put}) {

      const result = yield call(getClassDataAll, {});
      if (!validResult(result)) {
        return;
      }
      yield put({
        type: 'saveCP',
        payload: {classDataAll: result.data.list},
      });
    },
    * getData({payload, callback}, {call, select, put}) {
      let params = {
        endDate: payload && payload.endDate ? moment(payload.endDate).format('YYYY-MM-DD') : '',
        startDate: payload && payload.beginDate ? moment(payload.beginDate).format('YYYY-MM-DD') : '',
      };
      const result = yield call(getData, params);
      if (!validResult(result)) {
        return;
      }
      let temp = [];
      temp.push({
        x: '参观人数', y: result.data.missionCount,
      })
      temp.push({
        x: '参与活动人数', y: result.data.activityCount,
      })
      temp.push({
        x: '展板访问总数', y: result.data.visitCount,
      })
      temp.push({
        x: '随机答题次数', y: result.data.randomCount,
      })
      temp.push({
        x: '知识点答题总数', y: result.data.topicCount,
      })
      temp.push({
        x: '完成任务总数', y: result.data.missionCompleteCount,
      })
      temp.push({
        x: '获得证书人数', y: result.data.getCertificateUserCount,
      })
      yield put({
        type: 'saveCP',
        payload: {visitData: temp},
      });
    },

    * getUserData({payload, callback}, {call, put, select}) {
      let params = {
        endDate: payload && payload.endDate ? moment(payload.endDate).format('YYYY-MM-DD') : '',
        startDate: payload && payload.beginDate ? moment(payload.beginDate).format('YYYY-MM-DD') : '',
        classId: payload && payload.classId ? payload.classId : '',
      };
      const result = yield call(getUserData, params);
      if (!validResult(result)) {
        return;
      }
      let temp = [];
      temp.push({
        x: '任务数', y: result.data.missionCount,
      })
      // temp.push({
      //   x:'学习展板数', y: result.data.,
      // })
      temp.push({
        x: '参与互动数', y: result.data.activityCount,
      })
      temp.push({
        x: '随机答题数', y: result.data.randomCount,
      })
      temp.push({
        x: '知识点答题数', y: result.data.topicCount,
      })
      temp.push({
        x: '扫码答题数', y: result.data.qrAnswerCount,
      })
      temp.push({
        x: '使用多媒体设备数', y: result.data.multimediaCount,
      })
      yield put({
        type: 'saveCP',
        payload: {userData: temp},
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
  },
}
