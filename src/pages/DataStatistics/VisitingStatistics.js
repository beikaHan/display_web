import React, {Component} from 'react';
import {connect} from 'dva';
import {
  Table,
  Card,
  Form,
  Input,
  Select,
  Switch,
  Icon,
  Col,
  Button,
  Dropdown,
  Menu,
  DatePicker,
  TimePicker,
  Modal,
  message,
  Radio,
  Upload,
  notification,
} from 'antd';
import {routerRedux} from "dva/router";
import Inputval from "../../components/QueryConditionItem/Inputval.js";
import BtnSearch from "../../components/QueryConditionItem/BtnSearch.js";
import Date from "../../components/QueryConditionItem/Date.js";
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Manage.less';
import moment from 'moment';

import {
  ChartCard, yuan, MiniArea, MiniBar, MiniProgress, Field, Bar, Pie, TimelineChart,
} from '../../components/Charts';

const confirm = Modal.confirm;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const {Option} = Select;
const {TextArea} = Input;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  dataStatistics: state.dataStatistics,
}))
@Form.create()
export default class VipManage extends Component {
  state = {
    formValues: {},
  };

  componentDidMount() {
    this.handleSearch()

  }

  handleSearch = (e) => {
    if (e) {
      e.preventDefault()

    }
    const {dispatch, form} = this.props;
    const {pagination} = this.state;
    form.validateFields((err, fieldsValue) => {
      // if (err) return;
      const values = {
        ...fieldsValue,
      };
      this.setState({
        formValues: values,
      });
      console.log(fieldsValue)

      dispatch({
        type: 'dataStatistics/getData',
        payload: values,
      });
    });
  };
  handleTabChange = (key) => {
    const {dispatch} = this.props;
    switch (key) {
      case 'visitingStatistics':
        dispatch(routerRedux.push('/dataStatistics/visitingStatistics'));
        break;
      case 'capabilityStatistics':
        dispatch(routerRedux.push('/dataStatistics/capabilityStatistics'));
        break;
      default:
        break;
    }
  };

  renderForm() {
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Date dispatch={this.props} con={'日期期间'}/>
        <BtnSearch dispatch={this.props} con={'搜索'} size={{lg: 12, xl: 8, xxl: 1}}/>
      </Form>

    );
  }


  render() {
    const {dataStatistics: {loading: ruleLoading, visitData}, form: {getFieldDecorator}} = this.props;
    const {vipListVisible, classManageEditItem, importVisible, uploading, fileList, memberListData} = this.state;
    const formItemLayout = {
      labelcol: {span: 6},
      wrappercol: {
        xs: {span: 28, offset: 0},
        sm: {span: 10, offset: 0},
      },
    };

    let tabList = [
      {key: 'visitingStatistics', tab: '参观统计'},
      {key: 'capabilityStatistics', tab: '能力统计'},
    ];
    return (
      <PageHeaderLayout
        tabList={tabList}
        activeIndex={0}
        onTabChange={this.handleTabChange}
      >
        <Card bordered={false}>
          <div className={styles.classManageList}>
            <div className={styles.classManageListForm}>
              {this.renderForm()}
            </div>
          </div>

          <Bar
            height={295}
            title={
              '参观统计'
            }
            data={visitData}
          /> </Card>
      </PageHeaderLayout>
    );
  }
}
