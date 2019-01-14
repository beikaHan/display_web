import moment from 'moment';
import {notification} from 'antd';
import {validResult} from '../../../utils/utilsValid';
import {
  addClassifyData, delClassify,
  getClassify,
  getClassifyItem,
  uptClassifyItem,
  addSchoolMaterialData, delSchoolMaterial,
  getSchoolMaterial,
  getSchoolMaterialItem,
  uptSchoolMaterialItem,
  getClassifyAll,
} from '../../../services/TeachingManage';

export default {
  namespace: 'teachingManage',

  state: {
    loading: false,
    classifyItem: {},
    classifyData: {
      list: [],
      pagination: {},
    },
    videoItem: {},
    videoData: {
      list: [],
      pagination: {},
    },
    picItem: {},
    picData: {
      list: [],
      pagination: {},
    },
    audioItem: {},
    audioData: {
      list: [],
      pagination: {},
    },
    documentItem: {},
    documentData: {
      list: [],
      pagination: {},
    },
    classifyAllData: []
  },

  subscriptions: {
    setup({dispatch, history}) {
      /*dispatch({
        type: 'init',
      })*/
    },
  },

  effects: {
    * getClassifyAll({payload, callback}, {call, select, put}) {
      let params = {};
      const result = yield call(getClassifyAll, params);
      if (!validResult(result)) {
        return;
      }

      yield put({
        type: 'saveCP',
        payload: {
          classifyAllData: result.data.list
        },
      });
    },
    * getClassifyList({payload, callback}, {call, select, put}) {
      let params = {
        rows: payload && payload.rows ? payload.rows : 10,
        page: payload && payload.page ? payload.page : 1,
        title: payload && payload.titleS ? payload.titleS : '',
      };
      const result = yield call(getClassify, params);
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
        type: 'saveClassifyData',
        payload: data,
      });
    },

    * addClassifyData({payload, callback}, {call, select, put}) {
      let params = {
        ...payload.values,
      };
      console.log(params)
      const result = yield call(addClassifyData, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getClassifyList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },

    * getClassifyItem({payload, callback}, {call, select, put}) {
      let params = {
        id: payload.id
      }
      const result = yield call(getClassifyItem, params);
      if (!validResult(result)) {
        return;
      }

      yield put({
        type: 'saveCP',
        payload: {
          classifyItem: result.data.schoolMaterialClassify
        },
      });
    },

    * uptClassifyData({payload, callback}, {call, select, put}) {
      let params = {
        ...payload.values,
      }
      const result = yield call(uptClassifyItem, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });

      yield put({
        type: 'getClassifyList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },

    * delClassifyData({payload, callback}, {call, select, put}) {
      console.log(payload)
      let params = {
        ids: payload && payload.ids ? payload.ids : []
      };
      const result = yield call(delClassify, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getClassifyList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },

    * getSchoolMaterialList({payload, callback}, {call, select, put}) {
      let params = {
        rows: payload && payload.rows ? payload.rows : 10,
        page: payload && payload.page ? payload.page : 1,
        title: payload && payload.titleS ? payload.titleS : '',
        classifyId: payload && payload.classifyIdS ? payload.classifyIdS : '',
        type: payload && payload.type ? payload.type : 1,
      };
      const result = yield call(getSchoolMaterial, params);
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
      if (params.type === 1) {
        yield put({
          type: 'saveVideoData',
          payload: data,
        });
      }
      if (params.type === 2) {
        yield put({
          type: 'savePicData',
          payload: data,
        });
      }
      if (params.type === 3) {
        yield put({
          type: 'saveAudioData',
          payload: data,
        });
      }
      if (params.type === 4) {
        yield put({
          type: 'saveDocumentData',
          payload: data,
        });
      }
    },

    * addSchoolMaterialData({payload, callback}, {call, select, put}) {
      let params = {
        ...payload.values,
      };
      console.log(params)
      const result = yield call(addSchoolMaterialData, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getSchoolMaterialList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },

    * getSchoolMaterialItem({payload, callback}, {call, select, put}) {
      let params = {
        id: payload.id,
        type: payload.type,
      }
      const result = yield call(getSchoolMaterialItem, params);
      if (!validResult(result)) {
        return;
      }
      if (params.type === 1) {
        yield put({
          type: 'saveCP',
          payload: {
            videoItem: result.data.schoolMaterial
          },
        });
      }
      if (params.type === 2) {
        yield put({
          type: 'saveCP',
          payload: {
            picItem: result.data.schoolMaterial
          },
        });
      }
      if (params.type === 3) {
        yield put({
          type: 'saveCP',
          payload: {
            audioItem: result.data.schoolMaterial
          },
        });
      }
      if (params.type === 4) {
        yield put({
          type: 'saveCP',
          payload: {
            documentItem: result.data.schoolMaterial
          },
        });
      }
      if (callback) callback(result.data.schoolMaterial);
    },

    * uptSchoolMaterialData({payload, callback}, {call, select, put}) {
      let params = {
        ...payload.values,
      }
      const result = yield call(uptSchoolMaterialItem, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });

      yield put({
        type: 'getSchoolMaterialList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },

    * delSchoolMaterialData({payload, callback}, {call, select, put}) {
      console.log(payload)
      let params = {
        ids: payload && payload.ids ? payload.ids : []
      };
      const result = yield call(delSchoolMaterial, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getSchoolMaterialList',
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
    saveClassifyData(state, action) {
      return {
        ...state,
        classifyData: action.payload,
      };
    },
    saveVideoData(state, action) {
      return {
        ...state,
        videoData: action.payload,
      };
    },
    savePicData(state, action) {
      return {
        ...state,
        picData: action.payload,
      };
    },
    saveAudioData(state, action) {
      return {
        ...state,
        audioData: action.payload,
      };
    },
    saveDocumentData(state, action) {
      return {
        ...state,
        documentData: action.payload,
      };
    },
  },
};
