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
  InputNumber
} from 'antd';
import {routerRedux} from 'dva/router';
import StudentManageTable from '../../components/PersonnelManage/StudentManageTable.js';
import Inputval from '../../components/QueryConditionItem/Inputval.js';
import BtnSearch from '../../components/QueryConditionItem/BtnSearch.js';
import DateAndTime from '../../components/QueryConditionItem/DateAndTime.js';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {
  ChartCard, yuan, MiniArea, MiniBar, MiniProgress, Field, Bar, Pie, TimelineChart,
} from '../../components/Charts';
import styles from './Manage.less';
import moment from 'moment';

const confirm = Modal.confirm;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const {Option} = Select;
const {TextArea} = Input;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  itemBankManage: state.itemBankManage,
}))
@Form.create()
export default class VipManage extends Component {
  state = {
    salesType: 'point',
  };

  componentDidMount() {
    const {dispatch} = this.props;
    const {pagination, formValues} = this.state;

    dispatch({
      type: 'itemBankManage/getSchoolCustomTestConfigoItem',

    });
  }

  handleTabChange = (key) => {
    const {dispatch} = this.props;
    switch (key) {
      case 'knowPointsManage':
        dispatch(routerRedux.push('/itemBankManage/know-points-manage'));
        break;
      case 'itemManage':
        dispatch(routerRedux.push('/itemBankManage/item-manage'));
        break;
      case 'customManage':
        dispatch(routerRedux.push('/itemBankManage/custom-manage'));
        break;
      case 'groupManage':
        dispatch(routerRedux.push('/itemBankManage/group-manage'));
        break;
      default:
        break;
    }
  };
  handleChangeSalesType = (e) => {
    this.setState({
      salesType: e.target.value,
    });
  }
  handleCancel = () => {
    this.props.form.resetFields();
  }
  handleChange = (e) => {
    e.preventDefault()
    console.log(this.props.form)
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      let values = {
        ...fieldsValue,
      };
      if (!values.topicTestSize || !values.topicHardPercent || !values.topicNormalPercent || !values.topicEasyPercent
        || !values.randomTestSize || !values.randomHardPercent || !values.randomNormalPercent || !values.randomEasyPercent) {
        notification.error({
          message: '请填写完整规则',
        });
        return;
      }
      if ((values.topicHardPercent + values.topicNormalPercent + values.topicEasyPercent) != 100) {
        notification.error({
          message: '知识点出题难易度占比总和应为100%',
        });
        return;
      }
      if ((values.randomHardPercent + values.randomNormalPercent + values.randomEasyPercent) != 100) {
        notification.error({
          message: '随机出题难易度占比总和应为100%',
        });
        return;
      }
      this.props.dispatch({
        type: 'itemBankManage/uptSchoolCustomTestConfigoData',
        payload: {
          values: {...values},
        },
      });
    });
  }

  render() {
    const {salesType} = this.state;
    const {
      itemBankManage: {
        loading: ruleLoading, schoolCustomTestConfigoData, schoolCustomTestConfigoItem,
        pointData, rendomData, randomTestSize, topicTestSize
      }, form: {getFieldDecorator}
    } = this.props;
    const salesPieData = salesType === 'point' ?
      pointData
      : rendomData;
    const salesPieSize = salesType === 'point' ?
      topicTestSize
      : randomTestSize;
    let tabList = [
      {key: 'knowPointsManage', tab: '知识点管理'},
      {key: 'itemManage', tab: '题库管理'},
      {key: 'customManage', tab: '自定义组题'},
      {key: 'groupManage', tab: '组题规则'},
    ];
    return (
      <PageHeaderLayout
        tabList={tabList}
        activeIndex={3}
        onTabChange={this.handleTabChange}
      >
        <Form onSubmit={this.handleChange} layout="inline">
          <div className={styles.content}>

            <div className={styles.tilflex} style={{padding: '0 10px', width: '150px'}}>知识点出题规则</div>

            <FormItem label="出题总数">
              {getFieldDecorator('topicTestSize', {
                  initialValue: topicTestSize,
                },
              )(
                <InputNumber min={1} max={100} style={{width: '100%'}}/>,
              )}
            </FormItem>
            <div className={styles.tilflex}>难易度占比</div>
            <FormItem label="困难">
              {getFieldDecorator('topicHardPercent', {
                  initialValue: pointData && pointData[0] && pointData[0].y,
                },
              )(
                <InputNumber min={1} max={100} formatter={value => `${value}%`}
                parser={value => value.replace('%', '')} style={{width: '100%'}}/>,
              )}
            </FormItem>
            <FormItem label="正常">
              {getFieldDecorator('topicNormalPercent', {
                  initialValue: pointData && pointData[1] && pointData[1].y,
                },
              )(
                <InputNumber min={1} max={100} formatter={value => `${value}%`}
                parser={value => value.replace('%', '')} style={{width: '100%'}}/>,
              )}
            </FormItem>
            <FormItem label="简单">
              {getFieldDecorator('topicEasyPercent', {
                  initialValue: pointData && pointData[2] && pointData[2].y,
                },
              )(
                <InputNumber min={1} max={100} formatter={value => `${value}%`}
                parser={value => value.replace('%', '')} style={{width: '100%'}}/>,
              )}
            </FormItem>


          </div>
          <div className={styles.content}>
            <div className={styles.tilflex} style={{padding: '0 10px', width: '150px'}}>随机出题规则</div>

            <FormItem label="出题总数">
              {getFieldDecorator('randomTestSize', {
                  initialValue: randomTestSize,
                },
              )(
                <InputNumber min={1} max={100} style={{width: '100%'}}/>,
              )}
            </FormItem>
            <div className={styles.tilflex}>难易度占比</div>
            <FormItem label="困难">
              {getFieldDecorator('randomHardPercent', {
                  initialValue: rendomData && rendomData[0] && rendomData[0].y,
                },
              )(
                <InputNumber min={1} max={100} formatter={value => `${value}%`}
                parser={value => value.replace('%', '')} style={{width: '100%'}}/>,
              )}
            </FormItem>
            <FormItem label="正常">
              {getFieldDecorator('randomNormalPercent', {
                  initialValue: rendomData && rendomData[1] && rendomData[1].y,
                },
              )(
                <InputNumber min={1} max={100} formatter={value => `${value}%`}
                parser={value => value.replace('%', '')} style={{width: '100%'}}/>,
              )}
            </FormItem>
            <FormItem label="简单">
              {getFieldDecorator('randomEasyPercent', {
                  initialValue: rendomData && rendomData[2] && rendomData[2].y,
                },
              )(
                <InputNumber min={1} max={100} formatter={value => `${value}%`}
                parser={value => value.replace('%', '')} style={{width: '100%'}}/>,
              )}
            </FormItem>


          </div>
          <span style={{width: '100%', display: 'block', textAlign: 'center', background: '#fff', padding: '20px 0'}}>
                <Button type="primary" htmlType="submit" style={{marginRight: '20px', padding: '0 50px'}}>保存</Button>
                <Button htmlType="submit" onClick={this.handleCancel} style={{padding: '0 50px'}}>取消</Button>
              </span>
        </Form>

        <Card
          className={styles.salesCard}
          bordered={false}
          title="出题规则"
          bodyStyle={{padding: 24}}
          extra={(
            <div className={styles.salesCardExtra}>

              <div className={styles.salesTypeRadio}>
                <Radio.Group value={salesType} onChange={this.handleChangeSalesType}>
                  <Radio.Button value="point">知识点</Radio.Button>
                  <Radio.Button value="redom">随机</Radio.Button>
                </Radio.Group>
              </div>
            </div>
          )}
          style={{marginTop: 24, minHeight: 509}}
        >
          <Pie
            hasLegend
            subTitle="出题总数"
            total={salesPieSize}
            data={salesPieData}
            height={248}
            lineWidth={4}
          />

        </Card>
      </PageHeaderLayout>
    );
  }
}
