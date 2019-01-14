import moment from 'moment';
import {notification} from 'antd';
import {validResult} from "../../../utils/utilsValid";
import {
  addTeacherData, delTeacher, getTeacher, getTeacherItem, uptTeacherItem,
  addStudentData, delStudent, getStudent, getStudentItem, uptStudentItem,
  addClassData, delClass, getClass, getClassItem, uptClassItem, getClassAll, getTeacherDetail
} from '../../../services/PersonnelManage';

export default {
  namespace: 'classManage',

  state: {
    loading: false,
    teacherItem: {},
    teacherData: {
      list: [],
      pagination: {},
    },
    classItem: {},
    classData: {
      list: [],
      pagination: {},
    },
    classDataAll: [],
    studentItem: {},
    studentData: {
      list: [],
      pagination: {},
    },
    teacherDetailData: {
      list: [],
      pagination: {},
    },
    studentDetailData: {
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
    * getTeacherList({payload, callback}, {call, select, put}) {
      let params = {
        rows: payload && payload.rows ? payload.rows : 10,
        page: payload && payload.page ? payload.page : 1,
        name: payload && payload.nameS ? payload.nameS : '',
        staffNo: payload && payload.staffNoS ? payload.staffNoS : '',
      };
      const result = yield call(getTeacher, params);
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
        type: 'saveTeacherData',
        payload: data,
      });
    },

    * addTeacherData({payload, callback}, {call, select, put}) {
      let params = {
        ...payload.values,
      };
      console.log(params)
      const result = yield call(addTeacherData, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getTeacherList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },

    * getTeacherItem({payload, callback}, {call, select, put}) {
      let params = {
        id: payload.id
      }
      const result = yield call(getTeacherItem, params);
      if (!validResult(result)) {
        return;
      }

      yield put({
        type: 'saveCP',
        payload: {
          teacherItem: result.data.schoolTeacher
        },
      });
    },

    * uptTeacherData({payload, callback}, {call, select, put}) {
      let params = {
        ...payload.values,
      }
      const result = yield call(uptTeacherItem, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });

      yield put({
        type: 'getTeacherList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },

    * delTeacherData({payload, callback}, {call, select, put}) {
      console.log(payload)
      let params = {
        ids: payload && payload.ids ? payload.ids : []
      };
      const result = yield call(delTeacher, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getTeacherList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },
    * getdetailInfo({payload, callback}, {call, select, put}) {
      let params = {
        ...payload
      };
      const result = yield call(getTeacherDetail, params);
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
        type: 'saveStudentDetailData',
        payload: data,
      });
      if (callback) callback();
    },
    * getTeacherDetail({payload, callback}, {call, select, put}) {
      let params = {
        ...payload
      };
      const result = yield call(getTeacherDetail, params);
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
        type: 'saveTeacherDetailData',
        payload: data,
      });
      if (callback) callback();
    },
    * getClassList({payload, callback}, {call, select, put}) {
      let params = {
        rows: payload && payload.rows ? payload.rows : 10,
        page: payload && payload.page ? payload.page : 1,
        title: payload && payload.titleS ? payload.titleS : '',
      };
      const result = yield call(getClass, params);
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
        type: 'saveClassData',
        payload: data,
      });
    },

    * addClassData({payload, callback}, {call, select, put}) {
      let params = {
        ...payload.values,
      };
      console.log(params)
      const result = yield call(addClassData, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getClassList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },

    * getClassItem({payload, callback}, {call, select, put}) {
      let params = {
        id: payload.id
      }
      const result = yield call(getClassItem, params);
      if (!validResult(result)) {
        return;
      }

      yield put({
        type: 'saveCP',
        payload: {
          classItem: result.data.schoolClass
        },
      });
    },

    * uptClassData({payload, callback}, {call, select, put}) {
      let params = {
        ...payload.values,
      }
      const result = yield call(uptClassItem, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });

      yield put({
        type: 'getClassList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },

    * delClassData({payload, callback}, {call, select, put}) {
      let params = {
        ids: payload && payload.ids ? payload.ids : []
      };
      const result = yield call(delClass, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getClassList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },
    * getClassAll({payload, callback}, {call, select, put}) {
      const result = yield call(getClassAll);
      if (!validResult(result)) {
        return;
      }

      yield put({
        type: 'saveCP',
        payload: {
          classDataAll: result.data.list
        },
      });
    },
    * getStudentList({payload, callback}, {call, select, put}) {
      let params = {
        rows: payload && payload.rows ? payload.rows : 10,
        page: payload && payload.page ? payload.page : 1,
        name: payload && payload.nameS ? payload.nameS : '',
        studentNo: payload && payload.studentNoS ? payload.studentNoS : '',
        classTitle: payload && payload.classTitleS ? payload.classTitleS : '',
        status: payload && payload.statusS ? payload.statusS : '',
      };
      const result = yield call(getStudent, params);
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
        type: 'saveStudentData',
        payload: data,
      });
    },

    * addStudentData({payload, callback}, {call, select, put}) {
      let params = {
        ...payload.values,
      };
      console.log(params)
      const result = yield call(addStudentData, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getStudentList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },

    * getStudentItem({payload, callback}, {call, select, put}) {
      let params = {
        id: payload.id
      }
      const result = yield call(getStudentItem, params);
      if (!validResult(result)) {
        return;
      }

      yield put({
        type: 'saveCP',
        payload: {
          studentItem: result.data.schoolStudent
        },
      });
    },

    * uptStudentData({payload, callback}, {call, select, put}) {
      let params = {
        ...payload.values,
      }
      const result = yield call(uptStudentItem, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });

      yield put({
        type: 'getStudentList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },

    * delStudentData({payload, callback}, {call, select, put}) {
      console.log(payload)
      let params = {
        ids: payload && payload.ids ? payload.ids : []
      };
      const result = yield call(delStudent, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getStudentList',
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
    saveTeacherData(state, action) {
      return {
        ...state,
        teacherData: action.payload,
      };
    },
    saveClassData(state, action) {
      return {
        ...state,
        classData: action.payload,
      };
    },
    saveStudentData(state, action) {
      return {
        ...state,
        studentData: action.payload,
      };
    },
    saveTeacherDetailData(state, action) {
      return {
        ...state,
        teacherDetailData: action.payload,
      };
    },
    saveStudentDetailData(state, action) {
      return {
        ...state,
        studentDetailData: action.payload,
      };
    },
  },
}
