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
  Switch,
  InputNumber,
} from 'antd';
import { connect } from 'dva';
import styles from './index.less';

import RemarkTableForm from './RemarkTableForm';

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
  onUploadChange = (e, key) => {
    this.props.onUploadChange(e.target.value, key);
  };
  onSwitchChange = (e, key) => {
    this.props.onSwitchChange(e, key);
  };
  onTextChange = (e, key) => {
    this.props.onTextChange(e.target.value, key);
  };
  handleresourceChange = (info, key, type) => {
    this.props.handleresourceChange(info, key, type);
  };

  changeUploadList = (type, key) => {
    this.props.changeUploadList(type, key);
  };

  renderForm() {
    const {
      itemId,
      addVisible,
      itemDetails,
      schoolQuestionTopicData,
      items,
      addModalTitle,
      recourseList,
      titleAll,
      onUploadChange,
    } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.dispatch.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: {
        xs: { span: 28, offset: 0 },
        sm: { span: 10, offset: 0 },
      },
    };
    let recourseObj = [],
      titleObj = [];
    recourseList &&
      recourseList.map(el => {
        recourseObj.push(
          <Option value={el.id} key={el.id}>
            {el.title}
          </Option>
        );
      });
    titleAll &&
      titleAll.map(el => {
        titleObj.push(
          <Option value={el.id} key={el.id}>
            {el.title}
          </Option>
        );
      });

    const remarkChange = newData => {
      this.setState({
        remarkDataEnd: newData,
      });
    };
    return (
      <div className={styles.showAdd}>
        <div className={addVisible ? styles.add : styles.hideAdd}>
          <div className={styles.nav}>
            <Icon type="left" className={styles.icon} onClick={this.handleGoBack} /> {addModalTitle}
          </div>
          <div className={styles.content}>
            <Form onSubmit={this.handleChange} layout="inline">
              <FormItem label="标题" {...formItemLayout} colon={false}>
                {getFieldDecorator('title', {
                  initialValue: itemId != undefined && itemDetails.title ? itemDetails.title : '',
                  rules: [{ required: true, message: '请输入标题' }],
                })(<Input placeholder={'请输入标题'} maxLength="30" autoComplete="off" />)}
              </FormItem>

              <FormItem label="描述" {...formItemLayout} colon={false}>
                {getFieldDecorator('content', {
                  rules: [
                    { required: true, message: '请输入描述' },
                    { max: 200, message: '超出长度限制' },
                  ],
                  initialValue:
                    itemId != undefined && itemDetails.content ? itemDetails.content : '',
                })(
                  <TextArea
                    placeholder={
                      itemId != undefined &&
                      itemDetails.content != undefined &&
                      itemDetails.content.length > 0
                        ? itemDetails.content
                        : '请输入描述'
                    }
                    className={styles.description}
                    onChange={this.onChangeUserName}
                  />
                )}
              </FormItem>
              <FormItem label="难易度" {...formItemLayout} colon={false}>
                {getFieldDecorator('level', {
                  initialValue: itemId != undefined && itemDetails.level ? itemDetails.level : 1,
                  rules: [
                    {
                      required: true,
                      message: '请选择难易度',
                    },
                  ],
                })(
                  <Select
                    placeholder={1}
                    getPopupContainer={() => document.getElementById('level')}
                  >
                    <Option value={1} key={1}>
                      简单
                    </Option>
                    <Option value={2} key={2}>
                      普通
                    </Option>
                    <Option value={3} key={3}>
                      困难
                    </Option>
                  </Select>
                )}
              </FormItem>

              <FormItem label="触发方式" {...formItemLayout} colon={false}>
                {getFieldDecorator('targetType', {
                  initialValue:
                    itemId != undefined && itemDetails.targetType ? itemDetails.targetType : 1,
                })(
                  <Select
                    placeholder={1}
                    getPopupContainer={() => document.getElementById('targetType')}
                  >
                    <Option value={1} key={1}>
                      默认
                    </Option>
                    <Option value={2} key={2}>
                      头衔触发
                    </Option>
                    <Option value={3} key={3}>
                      分数触发
                    </Option>
                    <Option value={4} key={4}>
                      进入展厅
                    </Option>
                  </Select>
                )}
              </FormItem>
              {getFieldValue('targetType') == 3 ? (
                <FormItem label="分数" {...formItemLayout} colon={false}>
                  {getFieldDecorator('targetScore', {
                    initialValue:
                      itemId != undefined && itemDetails.targetScore ? itemDetails.targetScore : 0,
                    rules: [{ required: true, message: '请输入分数' }],
                  })(
                    <InputNumber
                      min={1}
                      style={{ width: '100%' }}
                      placeholder={'请输入分数'}
                      autoComplete="off"
                    />
                  )}
                </FormItem>
              ) : null}
              {getFieldValue('targetType') == 2 ? (
                <FormItem label="头衔" {...formItemLayout} colon={false}>
                  {getFieldDecorator('rankId', {
                    initialValue:
                      itemId != undefined && itemDetails.rankId ? itemDetails.rankId : '',
                  })(
                    <Select
                      placeholder={1}
                      getPopupContainer={() => document.getElementById('rankId')}
                    >
                      {titleObj}
                    </Select>
                  )}
                </FormItem>
              ) : null}

              <FormItem label="任务" {...formItemLayout} colon={false}>
                <Card title="" className={styles.card} bordered={false}>
                  <div>
                    {getFieldDecorator('items', {
                      initialValue: items,
                    })(
                      <RemarkTableForm
                        onChange={items => remarkChange(items)}
                        recourseList={recourseList}
                        itemId={itemId}
                      />
                    )}
                  </div>
                </Card>
              </FormItem>
              <span style={{ width: '100%', display: 'block', textAlign: 'center' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: '20px', padding: '0 50px' }}
                >
                  保存
                </Button>
                <Button htmlType="submit" onClick={this.handleGoBack} style={{ padding: '0 50px' }}>
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
