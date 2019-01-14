import React, {Component} from 'react';
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
} from 'antd';
import {connect} from 'dva';
import styles from './index.less';
import {getCookie} from "../../utils";
import url from "../../utils/ipconfig";

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const {Option} = Select;
const {TextArea} = Input;

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
      this.setState({width});
    }
  };

  handleGoBack = () => {
    this.props.addHide();
  };
  handleChange = (e) => {
    e.preventDefault()
    this.props.add();
  }
  changeQuesList = (type, key) => {
    this.props.changeQuesList(type, key)
  };
  changeAnsList = (type, key, qkey) => {
    this.props.changeAnsList(type, key, qkey)
  };
  onChangeQues = (e, i) => {
    this.props.onChangeQues(e.target.value, i)
  };
  onChangeAns = (e, i, j) => {
    this.props.onChangeAns(e.target.value, i, j)
  };

  renderForm() {
    const {itemId, addVisible, itemDetails, addModalTitle, items} = this.props;
    const {getFieldDecorator, getFieldValue} = this.props.dispatch.form;
    const formItemLayout = {
      labelCol: {span: 4},
      wrapperCol: {
        xs: {span: 28, offset: 0},
        sm: {span: 10, offset: 0},
      },
    };
    return (
      <div className={styles.showAdd}>
        <div className={addVisible ? styles.add : styles.hideAdd}>
          <div className={styles.nav}><Icon type="left" className={styles.icon}
                                            onClick={this.handleGoBack}/> {addModalTitle}
          </div>
          <div className={styles.content}>
            <Form onSubmit={this.handleChange} layout="inline">
              <div className={styles.upload}>
                <FormItem label="标题" {...formItemLayout} colon={false}>
                  {getFieldDecorator('title', {
                    initialValue: itemId != '' && itemDetails.title ? itemDetails.title : '',
                    rules: [
                      {required: true, message: '请输入标题'},
                    ],
                  })(
                    <Input placeholder={'请输入标题'} maxLength="30" autoComplete="off"/>,
                  )}
                </FormItem>
              </div>

              {items && items.map((el, idx) => {
                return (
                  <div key={idx}>
                    <div className={styles.upload}>
                      <FormItem label={"问题" + (idx + 1)} {...formItemLayout} colon={false} className={styles.answer}>
                        {getFieldDecorator(`${'item-' + idx}${el.schoolQuestionnaireItem ? el.schoolQuestionnaireItem.content : ''}`, {
                          initialValue: el.schoolQuestionnaireItem && el.schoolQuestionnaireItem.content != undefined ? el.schoolQuestionnaireItem.content : '',
                          rules: [
                            {required: true, message: '请输入问题'},
                          ],
                        })(
                          <TextArea
                            className={styles.description} onChange={(e) => this.onChangeQues(e, idx)} maxLength={200}/>
                        )}
                      </FormItem>


                      <div style={{
                        marginTop: '9px',
                        height: '57px'
                      }}>{items.length > 1 ? <Button type="danger" ghost style={{float: 'right'}}
                                                     onClick={() => this.changeQuesList('minus', idx, el)}>删除问题</Button> : ''}<Button
                        type="dashed" style={{
                        marginRight: '10px', float: 'right'
                      }}
                        onClick={() => this.changeAnsList('plus', idx)}
                      >添加答案</Button>
                      </div>

                    </div>
                    {el.items && el.items.map((elitem, idxitem) => {
                      return (
                        <div className={styles.uploadAns} key={idx + '-' + idxitem}>
                          <FormItem label={'答案 ' + (idxitem + 1)} {...formItemLayout} colon={false}
                                    className={styles.answer}>
                            {getFieldDecorator(`${'item-' + idx + '-' + idxitem}${elitem.schoolQuestionnaireItemAnswer ? elitem.schoolQuestionnaireItemAnswer.content : ''}`, {
                              initialValue: elitem.schoolQuestionnaireItemAnswer && elitem.schoolQuestionnaireItemAnswer.content != undefined ? elitem.schoolQuestionnaireItemAnswer.content : '',
                              rules: [
                                {required: true, message: '请输入答案'},
                              ],
                            })(
                              <TextArea
                                className={styles.description} onChange={(e) => this.onChangeAns(e, idx, idxitem)}
                                maxLength={200}/>
                            )}
                          </FormItem>


                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItem: 'center',
                            marginBottom: '20px'
                          }}>
                            {el.items.length > 1 ? <Button type="danger" ghost
                                                           onClick={() => this.changeAnsList('minus', idx + '-' + idxitem, elitem)}>删除答案</Button> : ''}
                          </div>
                        </div>
                      )
                    })}

                  </div>
                )
              })}

              <div style={{width: '100%', marginLeft: '100px'}}>
                <Button
                  style={{width: '50%', marginTop: 16, marginBottom: 8}}
                  type="dashed"
                  onClick={() => this.changeQuesList('plus')}
                  icon="plus"
                  id={'mediaBtn'}
                >
                  添加问题
                </Button>
              </div>


              <span style={{width: '100%', display: 'block', textAlign: 'center', marginTop: 100}}>
                <Button type="primary" htmlType="submit" style={{marginRight: '20px', padding: '0 50px'}}>保存</Button>
                <Button htmlType="submit" onClick={this.handleGoBack} style={{padding: '0 50px'}}>取消</Button>
              </span>
            </Form>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderForm()}
      </div>
    );
  }
}

export default DishEdit;
