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

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
 const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJPG) {
    message.error('仅支持jpg或png格式');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片大小不能超过2MB!');
  }
  return isJPG && isLt2M;
}

@Form.create()
class DishEdit extends Component {
  state = {
    width: '100%',
    loading: false,
    loadingImg: false,
    thumbnailResourceId: '',
    imageUrl: '',
    uploading: {}
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
    this.props.add(this.state.thumbnailResourceId);
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
      console.log(info.file.response)
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loadingImg: false,
        thumbnailResourceId: info.file.response.resource.id
      }));
    }
  }
  onUploadChange = (e, key) => {
    this.props.onUploadChange(e.target.value, key)
  };

  renderForm() {
    const {itemId, addVisible, itemDetails, classifyDisplayAll, addModalTitle, items, uploading} = this.props;
    const {getFieldDecorator, getFieldValue} = this.props.dispatch.form;
    const {imageUrl} = this.state
    console.log(items)
    const formItemLayout = {
      labelCol: {span: 4},
      wrapperCol: {
        xs: {span: 28, offset: 0},
        sm: {span: 10, offset: 0},
      },
    };

    let classifyObj = [];
    classifyDisplayAll && classifyDisplayAll.map((el) => {
      classifyObj.push(
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
              <FormItem label="标题" {...formItemLayout} colon={false}>
                {getFieldDecorator('title', {
                  initialValue: itemId != undefined && itemDetails != undefined && itemDetails.title != undefined ? itemDetails.title : '',
                  rules: [{
                    required: true,
                    message: '请输入标题',
                  }],
                })(
                  <Input placeholder={'请输入标题'} maxLength="30" autoComplete="off"/>,
                )}
              </FormItem>

              <FormItem label="描述" {...formItemLayout} colon={false}>
                {getFieldDecorator('content', {
                  rules: [
                    {max: 200, message: '超出长度限制'},
                  ],
                  initialValue: itemId != undefined && itemDetails != undefined && itemDetails.content != undefined ? itemDetails.content : '',
                })(
                  <TextArea
                    placeholder={itemId != undefined && itemDetails != undefined && itemDetails.content != undefined && itemDetails.content.length > 0 ? itemDetails.content : '请输入提示语'}
                    className={styles.description} onChange={this.onChangeUserName}/>
                )}
              </FormItem>

              <FormItem label="分类" {...formItemLayout} colon={false}>
                {getFieldDecorator('classifyId', {
                  initialValue: itemId != undefined && itemDetails != undefined && itemDetails.classifyId != undefined ? itemDetails.classifyId : '',
                })(
                  <Select placeholder={'请选择分类'} getPopupContainer={() => document.getElementById('classifyId')}>
                    {classifyObj}
                  </Select>,
                )}
              </FormItem>

              <FormItem label="提示语" {...formItemLayout} colon={false}>
                {getFieldDecorator('alertContent', {
                  rules: [
                    {max: 200, message: '超出长度限制'},
                  ],
                  initialValue: itemId != undefined && itemDetails != undefined && itemDetails.alertContent != undefined ? itemDetails.alertContent : '',
                })(
                  <TextArea
                    placeholder={itemId != undefined && itemDetails != undefined && itemDetails.alertContent != undefined && itemDetails.alertContent.length > 0 ? itemDetails.alertContent : '请输入提示语'}
                    className={styles.description} onChange={this.onChangeUserName}/>
                )}
              </FormItem>
              {items && items.map((el, idx) => {
                return (
                  <div className={styles.upload} key={el.key}>
                    <FormItem label='' colon={false}>
                      {getFieldDecorator(`${el.key}${el.resourceId}`, {
                        initialValue: itemId != undefined && itemDetails != undefined || el.type != undefined ? el.type : 1,
                      })(
                        <RadioGroup onChange={(e) => this.onUploadChange(e, el.key)}>
                          <RadioButton value={1}>图文</RadioButton>
                          <RadioButton value={2}>视频</RadioButton>
                          <RadioButton value={3}>音频</RadioButton>
                        </RadioGroup>
                      )}
                    </FormItem>
                    <Upload
                      name="file"
                      showUploadList={false}
                      headers={{
                        // 'Content-Type': 'multipart/form-data',
                        'JSESSIONID': getCookie() ? getCookie() : null
                      }}
                      action={`${url.baseURL}/resource/upload`}
                      // beforeUpload={beforeUpload}
                      onChange={(info) => this.handleresourceChange(info, el.key, getFieldValue(`${el.key}${el.resourceId}`))}>
                      <Button style={{marginTop: '4px'}}>
                        <Icon type={uploading[el.key] ? 'loading' : 'upload'}/> {el.resourceId ? '已有资源' : 'Upload'}
                      </Button>
                    </Upload>

                    <Button style={{marginTop: '4px', marginLeft: '10px'}} type="danger" ghost
                            onClick={() => this.changeUploadList('minus', el.key)}>删除</Button>


                  </div>
                )
              })}

              <FormItem label="" colon={false}>
                {getFieldDecorator('thumbnailResourceId', {
                    initialValue: itemId != undefined && itemDetails != undefined && itemDetails.thumbnailResourceId ? itemDetails.thumbnailResourceId : '',

                  },
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
                      {imageUrl ?
                        <img src={imageUrl}
                             alt="ava"/> : itemId != undefined && itemDetails != undefined && itemDetails.thumbnailUrl ?
                          <img src={itemDetails.thumbnailUrl} alt="avatar"/> : <div>
                            <Icon type={this.state.loadingImg ? 'loading' : 'plus'}/>
                            <div className="ant-upload-text">Upload</div>
                            <div>图片仅支持jpg或png格式，且大小不超过2MB，比例为16:9</div>
                          </div>}
                    </Upload>

                  </div>
                )}
              </FormItem>
              <div style={{width: '100%', marginLeft: '100px'}}>
              <div style={{width: '50%',textAlign:'center'}}>资源上传不得超过200MB</div>
                <Button
                  style={{width: '50%', marginTop: 16, marginBottom: 8}}
                  type="dashed"
                  onClick={() => this.changeUploadList('plus')}
                  icon="plus"
                  id={'mediaBtn'}
                >
                  添加
                </Button>
              </div>

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
