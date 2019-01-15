import moment from 'moment';
import { notification } from 'antd';
import { validResult } from '../../../utils/utilsValid';
import {
  getSchoolQuestionTopicAll,
  addSchoolQuestionTopicData,
  delSchoolQuestionTopic,
  getSchoolQuestionTopic,
  getSchoolQuestionTopicItem,
  uptSchoolQuestionTopicItem,
  getSchoolQuestionBankAll,
  addSchoolQuestionBankData,
  delSchoolQuestionBank,
  getSchoolQuestionBank,
  getSchoolQuestionBankItem,
  uptSchoolQuestionBankItem,
  addSchoolCustomTestData,
  delSchoolCustomTest,
  getSchoolCustomTest,
  getSchoolCustomTestItem,
  uptSchoolCustomTestItem,
  addSchoolCustomTestConfigoData,
  delSchoolCustomTestConfigo,
  getSchoolCustomTestConfigo,
  getSchoolCustomTestConfigoItem,
  uptSchoolCustomTestConfigoItem,
  getSchoolCustomGenerateData,
} from '../../../services/SchoolQuestionManage';

export default {
  namespace: 'itemBankManage',

  state: {
    loading: false,
    schoolQuestionTopicItem: {},
    schoolQuestionTopicData: {
      list: [],
      pagination: {},
    },
    schoolCustomTestItem: {},
    schoolCustomTestData: {
      list: [],
      pagination: {},
    },
    schoolQuestionBankItem: {},
    schoolQuestionBankData: {
      list: [],
      pagination: {},
    },

    schoolCustomTestConfigoItem: {},
    schoolCustomTestConfigoData: {
      list: [],
      pagination: {},
    },
    pointData: [],
    rendomData: [],
    allData: [],
    randomTestSize: 0,
    topicTestSize: 0,
    items: [],
    schoolQuestionTopicDataAll: [],
    schoolCustomTestQuestions: [],
    schoolQuestionBankDataAll: [],
    questionBankId: '',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      /*dispatch({
        type: 'init',
      })*/
    },
  },

  effects: {
    *getSchoolQuestionTopicAll({ payload, callback }, { call, select, put }) {
      const result = yield call(getSchoolQuestionTopicAll);
      if (!validResult(result)) {
        return;
      }
      yield put({
        type: 'saveCP',
        payload: { schoolQuestionTopicDataAll: result.data.list },
      });
    },
    *getSchoolQuestionTopicList({ payload, callback }, { call, select, put }) {
      let params = {
        rows: payload && payload.rows ? payload.rows : 10,
        page: payload && payload.page ? payload.page : 1,
        title: payload && payload.titleS ? payload.titleS : '',
      };
      const result = yield call(getSchoolQuestionTopic, params);
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
        type: 'saveSchoolQuestionTopicData',
        payload: data,
      });
    },

    *addSchoolQuestionTopicData({ payload, callback }, { call, select, put }) {
      let params = {
        ...payload.values,
      };
      console.log(params);
      const result = yield call(addSchoolQuestionTopicData, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getSchoolQuestionTopicList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },

    *getSchoolQuestionTopicItem({ payload, callback }, { call, select, put }) {
      let params = {
        id: payload.id,
      };
      const result = yield call(getSchoolQuestionTopicItem, params);
      if (!validResult(result)) {
        return;
      }

      yield put({
        type: 'saveCP',
        payload: {
          schoolQuestionTopicItem: result.data.schoolQuestionTopic,
        },
      });
    },

    *uptSchoolQuestionTopicData({ payload, callback }, { call, select, put }) {
      let params = {
        ...payload.values,
      };
      const result = yield call(uptSchoolQuestionTopicItem, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'saveCP',
        payload: {
          schoolQuestionTopicItem: result.data.school,
        },
      });
      yield put({
        type: 'getSchoolQuestionTopicList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },

    *delSchoolQuestionTopicData({ payload, callback }, { call, select, put }) {
      console.log(payload);
      let params = {
        ids: payload && payload.ids ? payload.ids : [],
      };
      const result = yield call(delSchoolQuestionTopic, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getSchoolQuestionTopicList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },
    *getSchoolQuestionBankAll({ payload, callback }, { call, select, put }) {
      const result = yield call(getSchoolQuestionBankAll);
      if (!validResult(result)) {
        return;
      }
      yield put({
        type: 'saveCP',
        payload: { schoolQuestionBankDataAll: result.data.list },
      });
    },
    *getSchoolQuestionBankList({ payload, callback }, { call, select, put }) {
      let params = {
        rows: payload && payload.rows ? payload.rows : 10,
        page: payload && payload.page ? payload.page : 1,
        content: payload && payload.contentS ? payload.contentS : '',
        level: payload && payload.levelS ? payload.levelS : '',
        questionType: payload && payload.questionTypeS ? payload.questionTypeS : '',
      };
      const result = yield call(getSchoolQuestionBank, params);
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
        type: 'saveSchoolQuestionBankData',
        payload: data,
      });
      if (callback) callback();
    },

    *addSchoolQuestionBankData({ payload, callback }, { call, select, put }) {
      let params = {
        ...payload.values,
      };
      console.log(params);
      const result = yield call(addSchoolQuestionBankData, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getSchoolQuestionBankList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },

    *getSchoolQuestionBankItem({ payload, callback }, { call, select, put }) {
      let params = {
        id: payload.id,
      };
      const result = yield call(getSchoolQuestionBankItem, params);
      if (!validResult(result)) {
        return;
      }
      for (let i = 0; i < result.data.items.length; i++) {
        result.data.items[i].key = i;
      }
      yield put({
        type: 'saveCP',
        payload: {
          schoolQuestionBankItem: result.data.schoolQuestionBank,
          items: result.data.items,
        },
      });
      if (callback) callback(result.data.items);
    },

    *uptSchoolQuestionBankData({ payload, callback }, { call, select, put }) {
      let params = {
        ...payload.values,
      };
      const result = yield call(uptSchoolQuestionBankItem, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getSchoolQuestionBankList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },

    *delSchoolQuestionBankData({ payload, callback }, { call, select, put }) {
      console.log(payload);
      let params = {
        ids: payload && payload.ids ? payload.ids : [],
      };
      const result = yield call(delSchoolQuestionBank, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getSchoolQuestionBankList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },

    *getSchoolCustomTestList({ payload, callback }, { call, select, put }) {
      let params = {
        rows: payload && payload.rows ? payload.rows : 10,
        page: payload && payload.page ? payload.page : 1,
        title: payload && payload.titleS ? payload.titleS : '',
        level: payload && payload.cusLevelS ? payload.cusLevelS : '',
      };
      const result = yield call(getSchoolCustomTest, params);
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
        type: 'saveSchoolCustomTestData',
        payload: data,
      });
    },

    *addSchoolCustomTestData({ payload, callback }, { call, select, put }) {
      let params = {
        ...payload.values,
      };
      console.log(params);
      const result = yield call(addSchoolCustomTestData, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getSchoolCustomTestList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },

    *getSchoolCustomTestItem({ payload, callback }, { call, select, put }) {
      let params = {
        id: payload.id,
      };
      const result = yield call(getSchoolCustomTestItem, params);
      if (!validResult(result)) {
        return;
      }
      for (let i = 0; i < result.data.questions.length; i++) {
        result.data.questions[i].key = i;
      }
      yield put({
        type: 'saveCP',
        payload: {
          schoolCustomTestItem: result.data.schoolCustomTest,
          schoolCustomTestQuestions: result.data.questions,
        },
      });
      if (callback) callback(result.data.questions);
    },

    *uptSchoolCustomTestData({ payload, callback }, { call, select, put }) {
      let params = {
        ...payload.values,
      };
      const result = yield call(uptSchoolCustomTestItem, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getSchoolCustomTestList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },

    *delSchoolCustomTestData({ payload, callback }, { call, select, put }) {
      console.log(payload);
      let params = {
        ids: payload && payload.ids ? payload.ids : [],
      };
      const result = yield call(delSchoolCustomTest, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getSchoolCustomTestList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },

    *getSchoolCustomTestConfigoList({ payload, callback }, { call, select, put }) {
      let params = {
        rows: payload && payload.rows ? payload.rows : 10,
        page: payload && payload.page ? payload.page : 1,
        title: payload && payload.titleS ? payload.titleS : '',
      };
      const result = yield call(getSchoolCustomTestConfigo, params);
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
        type: 'saveSchoolCustomTestConfigoData',
        payload: data,
      });
    },

    *addSchoolCustomTestConfigoData({ payload, callback }, { call, select, put }) {
      let params = {
        ...payload.values,
      };
      console.log(params);
      const result = yield call(addSchoolCustomTestConfigoData, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getSchoolCustomTestConfigoList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },

    *getSchoolCustomTestConfigoItem({ payload, callback }, { call, select, put }) {
      const result = yield call(getSchoolCustomTestConfigoItem, {});
      if (!validResult(result)) {
        return;
      }
      let pointData = [
        { x: '困难', y: result.data.schoolCustomTestConfig.topicHardPercent },
        {
          x: '正常',
          y: result.data.schoolCustomTestConfig.topicNormalPercent,
        },
        { x: '简单', y: result.data.schoolCustomTestConfig.topicEasyPercent },
      ];
      let rendomData = [
        { x: '困难', y: result.data.schoolCustomTestConfig.randomHardPercent },
        {
          x: '正常',
          y: result.data.schoolCustomTestConfig.randomNormalPercent,
        },
        { x: '简单', y: result.data.schoolCustomTestConfig.randomEasyPercent },
      ];
      yield put({
        type: 'saveCP',
        payload: {
          pointData: pointData,
          rendomData: rendomData,
          randomTestSize: result.data.schoolCustomTestConfig.randomTestSize,
          topicTestSize: result.data.schoolCustomTestConfig.topicTestSize,
        },
      });
      if (callback) callback(result.data.schoolCustomTestConfig);
    },

    *uptSchoolCustomTestConfigoData({ payload, callback }, { call, select, put }) {
      let params = {
        ...payload.values,
      };
      console.log(params);
      const result = yield call(uptSchoolCustomTestConfigoItem, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getSchoolCustomTestConfigoItem',
      });
      if (callback) callback();
    },

    *delSchoolCustomTestConfigoData({ payload, callback }, { call, select, put }) {
      console.log(payload);
      let params = {
        ids: payload && payload.ids ? payload.ids : [],
      };
      const result = yield call(delSchoolCustomTestConfigo, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getSchoolCustomTestConfigoList',
        payload: {
          ...payload.searchVal,
        },
      });
      if (callback) callback();
    },

    *getSchoolCustomGenerateData({ payload, callback }, { call, select, put }) {
      let params = {
        type: payload && payload.type ? payload.type : 1,
      };
      const result = yield call(getSchoolCustomGenerateData, params);
      if (!validResult(result)) {
        return;
      }
      yield put({
        type: 'saveCP',
        payload: {
          questionBankId: result.data.testId,
        },
      });
      // if (callback) callback(questionBankId);
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
    saveSchoolQuestionTopicData(state, action) {
      return {
        ...state,
        schoolQuestionTopicData: action.payload,
      };
    },

    saveSchoolQuestionBankData(state, action) {
      return {
        ...state,
        schoolQuestionBankData: action.payload,
      };
    },

    saveSchoolCustomTestData(state, action) {
      return {
        ...state,
        schoolCustomTestData: action.payload,
      };
    },

    saveSchoolCustomTestConfigoData(state, action) {
      return {
        ...state,
        schoolCustomTestConfigoData: action.payload,
      };
    },
  },
};
