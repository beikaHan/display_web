import React, { Component } from 'react';
import moment from 'moment';
import {
  Card,
  Button,
  Form,
  Icon,
  Col,
  Row,
  DatePicker,
  TimePicker,
  Input,
  Select,
  Popover,
  Radio,
  Upload,
  message,
  Modal,
  notification,
  InputNumber,
  Switch,
} from 'antd';
import { connect } from 'dva';
import styles from './index.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Option } = Select;
const { TextArea } = Input;

@Form.create()
class DishEdit extends Component {
  state = {
    width: '100%',
  };

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  };

  handleGoBack = () => {
    this.props.addHide();
  };
  handleChange = e => {
    e.preventDefault();
    this.props.add();
  };
  typeChange = e => {
    this.props.typeChange(e.target.value);
  };

  renderForm() {
    const { itemId, addVisible, itemDetails, schoolQuestionTopicData, recourseList } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.dispatch.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: {
        xs: { span: 28, offset: 0 },
        sm: { span: 10, offset: 0 },
      },
    };
    let recourseObj = [];
    recourseList &&
      recourseList.map(el => {
        recourseObj.push(
          <Option value={el.id} key={el.id}>
            {el.title}
          </Option>
        );
      });
    return (
      <div className={styles.showAdd}>
        <div className={addVisible ? styles.add : styles.hideAdd}>
          <div className={styles.nav}>
            <Icon type="left" className={styles.icon} onClick={this.handleGoBack} />{' '}
            {itemId != undefined ? '编辑' : '新增'}
          </div>
          <div className={styles.content}>
            <Form onSubmit={this.handleChange} layout="inline">
              <FormItem label="uuid" {...formItemLayout} colon={false}>
                {getFieldDecorator('uuid', {
                  initialValue:
                    itemId != undefined && itemDetails && itemDetails.uuid ? itemDetails.uuid : '',
                  rules: [{ required: true, message: '请输入uuid' }],
                })(<Input placeholder={'请输入uuid'} maxLength="100" autoComplete="off" />)}
              </FormItem>

              <FormItem label="主id" {...formItemLayout} colon={false}>
                {getFieldDecorator('major', {
                  initialValue:
                    itemId != undefined && itemDetails && itemDetails.major
                      ? itemDetails.major
                      : '',
                  rules: [{ required: true, message: '请输入主id' }],
                })(<Input placeholder={'请输入主id'} maxLength="100" autoComplete="off" />)}
              </FormItem>

              <FormItem label="次id" {...formItemLayout} colon={false}>
                {getFieldDecorator('minor', {
                  initialValue:
                    itemId != undefined && itemDetails && itemDetails.minor
                      ? itemDetails.minor
                      : '',
                  rules: [{ required: true, message: '请输入次id' }],
                })(<Input placeholder={'请输入次id'} maxLength="100" autoComplete="off" />)}
              </FormItem>

              <FormItem label="标题" {...formItemLayout} colon={false}>
                {getFieldDecorator('title', {
                  initialValue:
                    itemId != undefined && itemDetails && itemDetails.title
                      ? itemDetails.title
                      : '',
                  rules: [{ required: true, message: '请输入标题' }],
                })(<Input placeholder={'请输入标题'} maxLength="100" autoComplete="off" />)}
              </FormItem>
              <FormItem label="注" {...formItemLayout} colon={false}>
                <div>推送消息/任务时候，小程序端显示标题</div>
              </FormItem>

              <FormItem label="描述" {...formItemLayout} colon={false}>
                {getFieldDecorator('content', {
                  rules: [{ max: 500, message: '超出长度限制' }],
                  initialValue:
                    itemId != undefined &&
                    itemDetails != undefined &&
                    itemDetails &&
                    itemDetails.content != undefined &&
                    itemDetails.content.length > 0
                      ? itemDetails.content
                      : '',
                })(
                  <TextArea
                    placeholder={'请输入描述'}
                    className={styles.description}
                    onChange={this.onChangeUserName}
                  />
                )}
              </FormItem>
              {/*<FormItem label="推送次数" {...formItemLayout} colon={false}>*/}
              {/*{getFieldDecorator('pushTimes', {*/}
              {/*initialValue: itemId != undefined && itemDetails && itemDetails.pushTimes ? itemDetails.pushTimes : '',*/}
              {/*rules: [*/}
              {/*{required: true, message: '请输入标题'},*/}
              {/*],*/}
              {/*})(*/}
              {/*<InputNumber min={1} placeholder={'请输入推送次数'} style={{width: '100%'}} maxLength="30" autoComplete="off"/>,*/}
              {/*)}*/}
              {/*</FormItem>*/}
              <FormItem label="推送内容" {...formItemLayout} colon={false}>
                {getFieldDecorator('type', {
                  initialValue:
                    itemId != undefined && itemDetails && itemDetails.type != undefined
                      ? itemDetails.type
                      : 1,
                  rules: [{ required: true, message: '请输入标题' }],
                })(
                  <RadioGroup onChange={e => this.typeChange(e)}>
                    <RadioButton value={1}>随机组题</RadioButton>
                    <RadioButton value={2}>知识点组题</RadioButton>
                    <RadioButton value={3}>图片</RadioButton>
                    <RadioButton value={4}>视频</RadioButton>
                    <RadioButton value={5}>音频</RadioButton>
                    <RadioButton value={6}>文档</RadioButton>
                    <RadioButton value={7}>展板</RadioButton>
                    <RadioButton value={8}>任务</RadioButton>
                    <RadioButton value={9}>自定义组题</RadioButton>
                  </RadioGroup>
                )}
              </FormItem>
              {getFieldValue('type') == 1 || getFieldValue('type') == 2 ? null : (
                <FormItem label="资源" {...formItemLayout} colon={false}>
                  {getFieldDecorator('relationId', {
                    initialValue:
                      itemId != undefined && itemDetails && itemDetails.relationId != undefined
                        ? itemDetails.relationId
                        : recourseList && recourseList[0]
                        ? recourseList[0].id
                        : '',
                  })(<Select placeholder="请选择">{recourseObj}</Select>)}
                </FormItem>
              )}

              <span style={{ width: '100%', display: 'block', textAlign: 'center' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: '20px', padding: '0 50px' }}
                >
                  保存
                </Button>
                <Button onClick={this.handleGoBack} style={{ padding: '0 50px' }}>
                  取消
                </Button>
              </span>
            </Form>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return <div>{this.renderForm()}</div>;
  }
}

export default DishEdit;
