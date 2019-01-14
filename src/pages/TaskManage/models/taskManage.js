import moment from 'moment';
import {notification} from 'antd';
import {validResult} from "../../../utils/utilsValid";
import {
  addSchoolMissionData, delSchoolMission,
  getSchoolMission,
  getSchoolMissionItem,
  uptSchoolMissionItem, getTitleAll, getSchoolMissionAll
} from '../../../services/SchoolMissionManage';
import {getRecourseList} from "../../../services/BluetoothManage";

export default {
  namespace: 'taskManage',

  state: {
    loading: false,
    schoolMissionItem: {},
    schoolMissionData: {
      list: [],
      pagination: {},
    },
    items: [],
    recourseList: [],
    titleAll: [],
  },

  subscriptions: {
    setup({dispatch, history}) {
      /*dispatch({
        type: 'init',
      })*/
    },
  },

  effects: {
    * getRecourseList({payload, callback}, {call, select, put}) {
      let params = {
        type: payload && payload.type ? payload.type : 1,
      };
      let result, taskTemp = [];
      if (payload && payload.type == 8) {
        result = yield call(getSchoolMissionAll, {});
        if (!validResult(result)) {
          return;
        }
        for (var i = 0; i < result.data.list.length; i++) {
          if (result.data.list[i].targetType == 1) {
            taskTemp.push(result.data.list[i])
          }
        }

        yield put({
          type: 'saveCP',
          payload: {
            recourseList: taskTemp
          },
        });
        if (callback) callback(taskTemp)
      } else {
        result = yield call(getRecourseList, params);
        if (!validResult(result)) {
          return;
        }
        yield put({
          type: 'saveCP',
          payload: {
            recourseList: result.data.items
          },
        });
        if (callback) callback(result.data.items)
      }

    },
    * getTitleAll({payload, callback}, {call, select, put}) {
      let params = {};
      const result = yield call(getTitleAll, params);
      if (!validResult(result)) {
        return;
      }
      yield put({
        type: 'saveCP',
        payload: {
          titleAll: result.data.list
        },
      });
    },

    * getSchoolMissionList({payload, callback}, {call, select, put}) {
      let params = {
        rows: payload && payload.rows ? payload.rows : 10,
        page: payload && payload.page ? payload.page : 1,
        title: payload && payload.titleS ? payload.titleS : '',
        level: payload && payload.levelS ? payload.levelS : '',
      };
      const result = yield call(getSchoolMission, params);
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
        type: 'saveSchoolMissionData',
        payload: data,
      });
    },

    * addSchoolMissionData({payload, callback}, {call, select, put}) {
      let params = {
        ...payload.values,
      };
      console.log(params)
      const result = yield call(addSchoolMissionData, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getSchoolMissionList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },

    * getSchoolMissionItem({payload, callback}, {call, select, put}) {
      let params = {
        id: payload.id
      }
      const result = yield call(getSchoolMissionItem, params);
      if (!validResult(result)) {
        return;
      }
      for (let i = 0; i < result.data.items.length; i++) {
        result.data.items[i].key = i
        // let param = {
        //   type: result.data.items[i].type,
        // };
        // let ret, taskTemp = [];
        // if (result.data.items[i].type == 8) {
        //   ret = yield call(getSchoolMissionAll, {});
        //   if (!validResult(ret)) {
        //     return;
        //   }
        //   for (var j = 0; j < ret.data.list.length; j++) {
        //     if (ret.data.list[j].targetType == 1) {
        //       taskTemp.push(ret.data.list[j])
        //     }
        //   }
        //   result.data.items[i].resourceList = taskTemp
        // } else {
        //
        //   ret = yield call(getRecourseList, param);
        //   if (!validResult(ret)) {
        //     return;
        //   }
        //   console.log(ret)
        //   result.data.items[i].resourceList = ret.data.items
        // }
      }
      yield put({
        type: 'saveCP',
        payload: {
          schoolMissionItem: result.data.schoolMission,
          items: result.data.items
        },
      });
      if (callback) callback(result.data.items)
    },

    * uptSchoolMissionData({payload, callback}, {call, select, put}) {
      let params = {
        ...payload.values,
      }
      const result = yield call(uptSchoolMissionItem, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getSchoolMissionList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },

    * delSchoolMissionData({payload, callback}, {call, select, put}) {
      console.log(payload)
      let params = {
        ids: payload && payload.ids ? payload.ids : []
      };
      const result = yield call(delSchoolMission, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getSchoolMissionList',
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
    saveSchoolMissionData(state, action) {
      return {
        ...state,
        schoolMissionData: action.payload,
      };
    },
  },
}
