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
  Checkbox,
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

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  // const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
  // if (!isJPG) {
  //   message.error('You can only upload JPG file!');
  // }
  // const isLt2M = file.size / 1024 / 1024 < 2;
  // if (!isLt2M) {
  //   message.error('Image must smaller than 2MB!');
  // }
  // return isJPG && isLt2M;
  // return isJPG;
}

@Form.create()
class DishEdit extends Component {
  state = {
    width: '100%',
    loading: false,
    loadingImg: false,
    materialResourceId: '',
    imageUrl: '',
    materialOther: ''
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
    this.setState({
      imageUrl: ''
    })
    this.props.addHide();
  };
  handleChange = (e) => {
    e.preventDefault()
    this.props.add(this.state.materialResourceId);
  }
  handleresourceChange = (info, key, type) => {
    this.props.handleresourceChange(info, key, type)
  }

  changeUploadList = (type, key) => {
    this.props.changeUploadList(type, key)

  };
  handleUptImgChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({loadingImg: true});
      return;
    }
    if (info.file.status === 'done') {
      console.log(info.file.type)
      if(info.file.type === 'image/jpeg' || info.file.type === 'image/png'){
        getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        materialOther: null,
        loadingImg: false,
        materialResourceId: info.file.response.resource.id
      }));
      }else{
        this.setState({
          imageUrl: null,
          materialOther: '已有资源',
        loadingImg: false,
        materialResourceId: info.file.response.resource.id
      })
      }
      
      // Get this url from response in real world.
      
    }
  }
  onUploadChange = (e, key) => {
    this.props.onUploadChange(e.target.value, key)
  };
  onSingleS = (e, key) => {
    this.props.onSingleChange(e.target.value, key)
  }
  normalVal = (items) => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].isCorrect && items[i].isCorrect === 1) {
        return i + 1
      }
    }
    return 1
  }

  normalMoreVal = (items) => {
    let temp = []
    for (let i = 0; i < items.length; i++) {
      if (items[i].isCorrect && items[i].isCorrect === 1) {
        temp.push(items[i].sort)
      }
    }
    return temp
  }

  renderForm() {
    const {itemId, addVisible, itemDetails, classifyDisplayAll, addModalTitle, items, schoolQuestionTopicData} = this.props;
    const {getFieldDecorator, getFieldValue} = this.props.dispatch.form;
    console.log(getFieldValue(`questionType`))
    console.log(itemDetails)
    const {imageUrl, materialOther} = this.state
    const formItemLayout = {
      labelCol: {span: 4},
      wrapperCol: {
        xs: {span: 28, offset: 0},
        sm: {span: 10, offset: 0},
      },
    };

    let questionTopicObj = [];
    schoolQuestionTopicData && schoolQuestionTopicData.map((el) => {
      questionTopicObj.push(
        <Option value={el.id} key={el.id}>{el.title}</Option>
      )
    })
    return (
      <div className={styles.showAdd}>
        <div className={addVisible ? styles.add : styles.hideAdd}>
          <div className={styles.nav}><Icon type="left" className={styles.icon}
                                            onClick={this.handleGoBack}/> {addModalTitle}
          </div>
          <div className={styles.content}>
            <Form onSubmit={this.handleChange} layout="inline">

              <FormItem label="知识点" {...formItemLayout} colon={false}>
                {getFieldDecorator('questionTopicId', {
                  initialValue: itemId != '' && itemDetails != undefined && itemDetails.questionTopicId != undefined ? itemDetails.questionTopicId : '',
                  rules: [
                    {required: true, message: '请选择知识点'},
                  ],
                })(
                  <Select placeholder={'无'} getPopupContainer={() => document.getElementById('questionTopicId')}>
                    {questionTopicObj}
                  </Select>,
                )}
              </FormItem>

              <FormItem label="难易度" {...formItemLayout} colon={false}>
                {getFieldDecorator('level', {
                  initialValue: itemId != '' && itemDetails != undefined && itemDetails.level != undefined ? itemDetails.level : 1,
                })(
                  <Select placeholder={1} getPopupContainer={() => document.getElementById('level')}>
                    <Option value={1} key={1}>简单</Option>
                    <Option value={2} key={2}>普通</Option>
                    <Option value={3} key={3}>困难</Option>
                  </Select>,
                )}
              </FormItem>

              <FormItem label="问题类型" {...formItemLayout} colon={false}>
                {getFieldDecorator('questionType', {
                  initialValue: itemId != '' && itemDetails != undefined && itemDetails.questionType != undefined ? itemDetails.questionType : 1,
                })(
                  <Select placeholder={1} getPopupContainer={() => document.getElementById('questionType')}>
                    <Option value={1} key={1}>单选</Option>
                    <Option value={2} key={2}>多选</Option>
                    <Option value={4} key={4}>判断</Option>
                  </Select>,
                )}
              </FormItem>

              <FormItem label="题目信息" {...formItemLayout} colon={false}>
                {getFieldDecorator('content', {
                  rules: [
                    {required: true, message: '请输入题目信息'},
                    {max: 200, message: '超出长度限制'},
                  ],
                  initialValue: itemId != '' && itemDetails != undefined && itemDetails.content != undefined ? itemDetails.content : '',
                })(
                  <TextArea
                    placeholder={itemId != '' && itemDetails != undefined && itemDetails.content != undefined && itemDetails.content.length > 0 ? itemDetails.content : '请输入提示语'}
                    className={styles.description}/>
                )}
              </FormItem>

              {getFieldValue(`questionType`) === 1 ?

                <FormItem label="单选答案" {...formItemLayout} colon={false}>
                  {getFieldDecorator(`item`, {
                    initialValue: this.normalVal(items),
                  })(
                    <RadioGroup>
                      {items && items.map((el, idx) => {
                        return (<div className={styles.upload} key={el.key}>
                          <Radio value={idx + 1} key={idx + 1}>{idx + 1}</Radio>
                          <Input defaultValue={el.content} onChange={(e) => this.onSingleS(e, el.key)}/>

                          <Button style={{marginLeft: '10px'}} type="danger" ghost
                                  onClick={() => this.changeUploadList('minus', el.key, el.sort)}>删除</Button>
                        </div>)
                      })}
                    </RadioGroup>
                  )}
                </FormItem>
                : null}


              {getFieldValue(`questionType`) === 2 ?

                <FormItem label="多选答案" {...formItemLayout} colon={false}>
                  {getFieldDecorator(`itemMore`, {
                    initialValue: this.normalMoreVal(items),
                  })(
                    <Checkbox.Group style={{width: '100%'}}>
                      {items && items.map((el, idx) => {
                        return (<div className={styles.upload} key={el.key}>
                          <Checkbox value={idx + 1} key={idx + 1}>{idx + 1}</Checkbox><Input defaultValue={el.content}
                                                                                             onChange={(e) => this.onSingleS(e, el.key)}/>

                          <Button style={{marginLeft: '10px'}} type="danger" ghost
                                  onClick={() => this.changeUploadList('minus', el.key)}>删除</Button>

                        </div>)
                      })}
                    </Checkbox.Group>
                  )}
                </FormItem>
                : null}

              {getFieldValue(`questionType`) === 4 ?
                <FormItem label="是否正确" {...formItemLayout} colon={false}>
                  {getFieldDecorator(`itemNike`, {
                    initialValue: items && items[0] && items[0].isCorrect == 1 ? 1 : 2,
                  })(
                    <RadioGroup>
                      <Radio value={1} key={1}>对</Radio>
                      <Radio value={2} key={2}>错</Radio>
                    </RadioGroup>
                  )}

                </FormItem>

                : null}

              <FormItem label="" colon={false}>
                {getFieldDecorator('materialResourceId'
                )(
                  <div className={styles.img} onClick={this.showPicImportModal}>
                    <Upload
                      name="file"
                      listType="picture-card"
                      showUploadList={false}
                      headers={{
                        // 'Content-Type': 'multipart/form-data',
                        'JSESSIONID': getCookie() ? getCookie() : null
                      }}
                      action={`${url.baseURL}/resource/upload`}
                      beforeUpload={beforeUpload}
                      onChange={this.handleUptImgChange}>
                      {
                        imageUrl ? <img src={imageUrl} alt="ava"/> : 
                        materialOther ? <div>
                                          <Icon type={this.state.loadingImg ? 'loading' : 'plus'}/>
                                          <div className="ant-upload-text">已上传过资源</div>
                                        </div> : 
                        itemId != '' && itemDetails != undefined && itemDetails.materialUrl? (itemDetails.materialType == 'jpg' || itemDetails.materialType == 'png' || itemDetails.materialType == 'jpeg') ?
                                  <img src={itemDetails.materialUrl} alt="avatar"/> :
                                  <div>
                                    <Icon type={this.state.loadingImg ? 'loading' : 'plus'}/>
                                    <div className="ant-upload-text">已上传过资源</div>
                                  </div> :
                                  <div>
                                    <Icon type={this.state.loadingImg ? 'loading' : 'plus'}/>
                                    <div className="ant-upload-text">Upload</div>
                                    <div>图片仅支持jpg或png格式，图片不得超过2MB，比例为16:9，视频大小不得超过200MB</div>
                                  </div>
                      }
                      
                    </Upload>
                  </div>
                )}
              </FormItem>
              {getFieldValue(`questionType`) === 4||items.length>=9 ? null : <div style={{width: '100%', marginLeft: '100px'}}>
                <Button
                  style={{width: '50%', marginTop: 16, marginBottom: 8}}
                  type="dashed"
                  onClick={() => this.changeUploadList('plus')}
                  icon="plus"
                  id={'mediaBtn'}
                >
                  添加答案
                </Button>
              </div>}
              <span style={{width: '100%', display: 'block', textAlign: 'center'}}>
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
