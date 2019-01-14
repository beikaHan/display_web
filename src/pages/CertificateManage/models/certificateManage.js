import {
  addCertificateData, getCertificateItem
} from '../../../services/CertificateManage';
import {
  getBluetoothAll
} from '../../../services/BluetoothManage';
import moment from 'moment';
import {notification} from 'antd';
import {validResult} from "../../../utils/utilsValid";

export default {
  namespace: 'certificateManage',

  state: {
    loading: false,
    certificateItem: {},
    bluetoothAll: []
  },

  subscriptions: {
    setup({dispatch, history}) {
      /*dispatch({
        type: 'init',
      })*/
    },
  },

  effects: {
    * getBluetoothAll({payload, callback}, {call, select, put}) {
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
          bluetoothAll: result.data.list
        },
      });
    },
    * getCertificateItem({payload, callback}, {call, select, put}) {
      let params = {};
      const result = yield call(getCertificateItem, params);
      if (!validResult(result)) {
        return;
      }
      yield put({
        type: 'saveCP',
        payload: {
          certificateItem: result.data.schoolCertificate
        },
      });
    },

    * addCertificateData({payload, callback}, {call, select, put}) {
      let params = {
        ...payload.values,
      };
      console.log(params)
      const result = yield call(addCertificateData, params);
      if (!validResult(result)) {
        return;
      }
      notification.success({
        message: '操作成功',
      });
      yield put({
        type: 'getCertificateItem',
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
    saveSchoolRankData(state, action) {
      return {
        ...state,
        schoolRankData: action.payload,
      };
    },
  },
}
