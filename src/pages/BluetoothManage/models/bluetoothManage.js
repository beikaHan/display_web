import { memberList, updateMemberList } from '../../../services/PersonnelManage';
import moment from 'moment';
import { notification } from 'antd';
import { validResult } from '../../../utils/utilsValid';
import {
  addSchoolBluetoothData,
  delSchoolBluetooth,
  getSchoolBluetooth,
  getSchoolBluetoothItem,
  uptSchoolBluetoothItem,
  getRecourseList,
  getBluetoothAll,
} from '../../../services/BluetoothManage';
import { getSchoolMissionAll } from '../../../services/SchoolMissionManage';

export default {
  namespace: 'bluetoothManage',

  state: {
    loading: false,
    schoolBluetoothItem: {},
    schoolBluetoothData: {
      list: [],
      pagination: {},
    },
    recourseList: [],
    bluetoothAll: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      /*dispatch({
        type: 'init',
      })*/
    },
  },

  effects: {
    *getRecourseList({ payload, callback }, { call, select, put }) {
      let params = {
        type: payload && payload.type ? payload.type : 1,
      };
      let result,
        taskTemp = [];
      if (payload && payload.type == 8) {
        result = yield call(getSchoolMissionAll, {});
        if (!validResult(result)) {
          return;
        }
        for (var i = 0; i < result.data.list.length; i++) {
          if (result.data.list[i].targetType == 1) {
            taskTemp.push(result.data.list[i]);
          }
        }

        yield put({
          type: 'saveCP',
          payload: {
            recourseList: taskTemp,
          },
        });
      } else {
        result = yield call(getRecourseList, params);
        if (!validResult(result)) {
          return;
        }
        yield put({
          type: 'saveCP',
          payload: {
            recourseList: result.data.items,
          },
        });
      }
    },
    *getBluetoothAll({ payload, callback }, { call, select, put }) {
      let params = {
        type: payload && payload.type ? payload.type : 1,
      };
      const result = yield call(getBluetoothAll, params);
      if (!validResult(result)) {
        return;
      }
      yield put({
        type: 'saveCP',
        payload: {
          bluetoothAll: result.data.list,
        },
      });
    },
    *getSchoolBluetoothList({ payload, callback }, { call, select, put }) {
      let params = {
        rows: payload && payload.rows ? payload.rows : 10,
        page: payload && payload.page ? payload.page : 1,
        title: payload && payload.titleS ? payload.titleS : '',
        uuid: payload && payload.uuidS ? payload.uuidS : '',
      };
      const result = yield call(getSchoolBluetooth, params);
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
        type: 'saveSchoolBluetoothData',
        payload: data,
      });
    },

    *addSchoolBluetoothData({ payload, callback }, { call, select, put }) {
      let params = {
        ...payload.values,
      };
      console.log(params);
      const result = yield call(addSchoolBluetoothData, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getSchoolBluetoothList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },

    *getSchoolBluetoothItem({ payload, callback }, { call, select, put }) {
      let params = {
        id: payload.id,
      };
      const result = yield call(getSchoolBluetoothItem, params);
      if (!validResult(result)) {
        return;
      }
      yield put({
        type: 'getRecourseList',
        payload: {
          type: result.data.schoolBluetooth.type,
        },
      });
      yield put({
        type: 'saveCP',
        payload: {
          schoolBluetoothItem: result.data.schoolBluetooth,
        },
      });
    },

    *uptSchoolBluetoothData({ payload, callback }, { call, select, put }) {
      let params = {
        ...payload.values,
      };
      const result = yield call(uptSchoolBluetoothItem, params);
      if (!validResult(result)) {
        return;
      }

      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getSchoolBluetoothList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },

    *delSchoolBluetoothData({ payload, callback }, { call, select, put }) {
      console.log(payload);
      let params = {
        ids: payload && payload.ids ? payload.ids : [],
      };
      const result = yield call(delSchoolBluetooth, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getSchoolBluetoothList',
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
    saveSchoolBluetoothData(state, action) {
      return {
        ...state,
        schoolBluetoothData: action.payload,
      };
    },
  },
};
