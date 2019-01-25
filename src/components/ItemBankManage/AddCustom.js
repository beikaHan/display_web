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
  Checkbox,
  TreeSelect,
} from 'antd';
import { connect } from 'dva';
import styles from './index.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Option } = Select;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;

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
  selectKnow = e => {
    this.props.selectKnow(e);
  };
  changeUploadList = (type, key) => {
    this.props.changeUploadList(type, key);
  };

  onUploadChange = (e, key) => {
    this.props.onUploadChange(e.target.value, key);
  };

  onSelectChange = e => {
    this.props.onSelectChange(e.target.value);
  };

  selectQuestions = () => {
    this.props.selectQuestions(true);
  };

  renderForm() {
    const {
      itemId,
      addVisible,
      itemDetails,
      schoolQuestionTopicDataAll,
      classifyDisplayData,
      addModalTitle,
      schoolQuestionBankDataAll,
      items,
    } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.dispatch.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: {
        xs: { span: 28, offset: 0 },
        sm: { span: 10, offset: 0 },
      },
    };
    let schoolQuestionBankObj = [];
    schoolQuestionBankDataAll &&
      schoolQuestionBankDataAll.map(el => {
        schoolQuestionBankObj.push({ label: el.content, value: el.id });
      });

    let schoolQuestionTopicObj = [];
    schoolQuestionTopicDataAll &&
      schoolQuestionTopicDataAll.map(el => {
        schoolQuestionTopicObj.push(
          <Option value={el.id} key={el.id}>
            {el.content}
          </Option>
        );
      });

    const getBank = questionData => {
      let arr = [];
      if (questionData) {
        for (let i = 0; i < questionData.length; i++) {
          arr.push({
            label: questionData[i].content,
            value: questionData[i].id,
            key: questionData[i].id,
            id: questionData[i].id,
          });
        }
      }
      return arr;
    };
    const gegionsTreeProps = {
      treeData: getBank(schoolQuestionBankDataAll),
      dropdownClassName: 'gegionsTree',
      treeCheckStrictly: true,
      placeholder: '请选择题目',
      treeDefaultExpandAll: false,
      treeCheckable: true,
      showCheckedStrategy: TreeSelect.SHOW_ALL,
      onChange: this.onChange,
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
                  initialValue: itemId != '' && itemDetails.title ? itemDetails.title : '',
                  rules: [{ required: true, message: '请输入标题' }],
                })(<Input placeholder={'请输入标题'} maxLength="30" autoComplete="off" />)}
              </FormItem>

              <FormItem label="难易度" {...formItemLayout} colon={false}>
                {getFieldDecorator('level', {
                  initialValue: itemId != '' && itemDetails.level ? itemDetails.level : 1,
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
              <FormItem label="多媒体状态" {...formItemLayout} colon={false}>
                {getFieldDecorator('multiMediaState', {
                  initialValue:
                    itemId != '' && itemDetails.multiMediaState ? itemDetails.multiMediaState : 2,
                })(
                  <RadioGroup>
                    <Radio value={1} key={1}>
                      开启
                    </Radio>
                    <Radio value={2} key={2}>
                      关闭
                    </Radio>
                  </RadioGroup>
                )}
              </FormItem>
              <FormItem label="注" {...formItemLayout} colon={false}>
                <div>开启多媒体功能后，任务中推送的题组会要求用户扫码得到题组</div>
              </FormItem>
              {getFieldValue('multiMediaState') == 1 ? (
                <FormItem label="提示语" {...formItemLayout} colon={false}>
                  {getFieldDecorator('content', {
                    initialValue: itemId != '' && itemDetails.content ? itemDetails.content : '',
                  })(
                    <Input
                      placeholder={'请到某某某地方，扫某某某二维码'}
                      maxLength="30"
                      autoComplete="off"
                    />
                  )}
                </FormItem>
              ) : null}
              <FormItem label="出题类型" {...formItemLayout} colon={false}>
                {getFieldDecorator('type', {
                  initialValue: itemId != '' && itemDetails.type ? itemDetails.type : 1,
                })(
                  <Select
                    placeholder={1}
                    getPopupContainer={() => document.getElementById('type')}
                    onChange={this.selectKnow}
                  >
                    <Option value={1} key={1}>
                      随机出题
                    </Option>
                    <Option value={2} key={2}>
                      知识点出题
                    </Option>
                    <Option value={3} key={3}>
                      自定义题目
                    </Option>
                  </Select>
                )}
              </FormItem>

              {getFieldValue('type') == 2 ? (
                <FormItem
                  label={'知识点'}
                  {...formItemLayout}
                  colon={false}
                  className={styles.answer}
                >
                  {getFieldDecorator('questionTopicId', {
                    initialValue:
                      itemId != '' && itemDetails.questionTopicId != undefined
                        ? itemDetails.questionTopicId
                        : schoolQuestionTopicDataAll && schoolQuestionTopicDataAll[0]
                        ? schoolQuestionTopicDataAll[0].id
                        : '',
                    rules: [
                      {
                        required: true,
                        message: `请选择知识点`,
                      },
                    ],
                  })(<Select placeholder={'请选择知识点'}>{schoolQuestionTopicObj}</Select>)}
                </FormItem>
              ) : null}

              {/*{getFieldValue('type') == 3 ?*/}
              {/*<FormItem label={'题目'} {...formItemLayout} colon={false}>*/}
              {/*{getFieldDecorator('schoolQuestionBankId', {*/}
              {/*initialValue: itemId != '' && items? getBank(items) : {*/}
              {/*key: schoolQuestionBankDataAll && schoolQuestionBankDataAll[0] && schoolQuestionBankDataAll[0].content,*/}
              {/*value: schoolQuestionBankDataAll && schoolQuestionBankDataAll[0] && schoolQuestionBankDataAll[0].id*/}
              {/*},*/}
              {/*rules: [{*/}
              {/*required: true,*/}
              {/*message: `请选择题目`*/}
              {/*}]*/}
              {/*})(*/}
              {/*<TreeSelect {...gegionsTreeProps}/>*/}
              {/*)}*/}

              {/*</FormItem>*/}
              {/*: null}*/}
              {getFieldValue('type') == 3 ? (
                <FormItem label={'题目'} {...formItemLayout} colon={false}>
                  {getFieldDecorator('schoolQuestionBankId', {
                    initialValue:
                      itemId != '' && itemDetails.questionTopicId != undefined
                        ? itemDetails.questionTopicId
                        : schoolQuestionTopicDataAll && schoolQuestionTopicDataAll[0]
                        ? schoolQuestionTopicDataAll[0].id
                        : '',
                    rules: [
                      {
                        required: true,
                        message: `请选择题目`,
                      },
                    ],
                  })(
                    <Button type="primary" onClick={this.selectQuestions}>
                      选择题目
                    </Button>
                  )}
                </FormItem>
              ) : null}

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
