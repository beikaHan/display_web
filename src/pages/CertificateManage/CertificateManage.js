import React, {Component} from 'react';
import {connect} from 'dva';
import {
  Icon,
  Upload,
  Card,
  Form,
  Switch,
  Button,
  Input,
  Select,
  Modal,
  message,
  Radio,
  notification,
  InputNumber
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Manage.less';
import Inputval from '../../components/QueryConditionItem/Inputval';

import {getCookie} from "../../utils";
import url from "../../utils/ipconfig";

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

const FormItem = Form.Item;

const RadioGroup = Radio.Group;

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

@connect(state => ({
  certificateManage: state.certificateManage,
}))
@Form.create()
export default class CertificateManage extends Component {
  state = {imageResourceId: ''};

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'certificateManage/getBluetoothAll',
    });
    dispatch({
      type: 'certificateManage/getCertificateItem',
    });
  }

  handleChange = (e) => {
    e.preventDefault();
    const {dispatch, form} = this.props;

    const {imageResourceId} = this.state
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        sorce: parseFloat(fieldsValue.sorce),
        isDefault: fieldsValue.isDefault ? 1 : 0,
        imageResourceId: imageResourceId
      };

      dispatch({
        type: 'certificateManage/addCertificateData',
        payload: {values: {...values}},
      });
    });
  };
  handleImgChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({loading: true});
      return;
    }
    if (info.file.status === 'done') {
      console.log(info.file.response)
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false,
        imageResourceId: info.file.response.resource.id
      }));
    }
  }

  render() {
    const {certificateManage: {loading: ruleLoading, certificateItem, bluetoothAll}, form: {getFieldDecorator, getFieldValue}} = this.props;
    const formItemLayout = {
      labelcol: {span: 6},
      wrappercol: {
        xs: {span: 28, offset: 0},
        sm: {span: 10, offset: 0},
      },
    };

    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'}/>
        <div className="ant-upload-text">头衔图片</div>
      </div>
    );

    const imageUrl = this.state.imageUrl;

    let recourseObj = [];
    bluetoothAll && bluetoothAll.map((el) => {
      recourseObj.push(
        <Select.Option value={el.id} key={el.id}>{el.title}</Select.Option>
      )
    })
    if (JSON.stringify(certificateItem)=="{}") {
      return false;
    }
    return (
      <PageHeaderLayout title="证书管理">
        <Card style={{height: '70vh'}} className={styles.car}>
          <Form onSubmit={this.handleChange} layout="inline">

            <div className={styles.content}>
              <div className={styles.swiflex}>
                <FormItem label="开启或关闭此功能">
                  {getFieldDecorator('isDefault', {
                    initialValue: certificateItem && certificateItem.isDefault ? certificateItem.isDefault : 2,
                  })(
                  <RadioGroup>
                          <Radio value={1}>是</Radio>
                          <Radio value={2}>否</Radio>
                        </RadioGroup>
                  )}
                </FormItem>
              </div>
              {getFieldValue('isDefault') == 1 ?
                <div className={styles.tilflex}>
                  <div className={styles.zhuflex}><FormItem label="">
                    {getFieldDecorator('imageResourceId', {
                      initialValue: certificateItem && certificateItem.imageResourceId ? certificateItem.imageResourceId : '',
                    })(
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
                        onChange={this.handleImgChange}>
                        {certificateItem && certificateItem.url ?
                          <img src={certificateItem.url} alt="ava"/> : imageUrl ? <img src={imageUrl} alt="avatar"/> :
                            <div>
                              <Icon type={this.state.loading ? 'loading' : 'plus'}/>
                              <div className="ant-upload-text">Upload</div>
                            </div>}
                      </Upload>
                    )}

                  </FormItem>
                    <span className={styles.spancenter}>图片仅支持jpg或png格式，且大小不超过2MB，尺寸为120*120</span></div>

                  <div className={styles.zhuflex}>
                    <FormItem label="祝语">
                      {getFieldDecorator('content', {
                        initialValue: certificateItem && certificateItem.content ? certificateItem.content : '',
                      })(
                        <Input placeholder={''} maxLength="15" autoComplete="off"/>,
                      )}
                    </FormItem>
                  </div>
                  <div className={styles.zhuflex}>
                    <FormItem label="获取方式">
                      {getFieldDecorator('type', {
                        initialValue: certificateItem && certificateItem.type ? certificateItem.type : 1,
                      })(
                        <RadioGroup>
                          <Radio value={1}>学分</Radio>
                          <Radio value={2}>考核</Radio>
                        </RadioGroup>
                      )}
                    </FormItem>
                    <span className={styles.spancenter}></span>
                  </div>
                  <div className={styles.zhuflex}>
                    {getFieldValue('type') == 1 ? <FormItem label="达到分数">
                        {getFieldDecorator('score', {
                          initialValue: certificateItem && certificateItem.score ? certificateItem.score : 0,
                          rules: [{
                            required: true,
                            message: '请输入分数',
                          }],
                        })(
                          <InputNumber min={1} style={{width: '100%'}}/>,
                        )}
                      </FormItem>
                      : <FormItem label="组题选择" {...formItemLayout} colon={false}>
                        {getFieldDecorator('relationId', {
                          initialValue: certificateItem && certificateItem.relationId ? certificateItem.relationId : bluetoothAll && bluetoothAll[0] ? bluetoothAll[0].id : '',
                          rules: [{
                            required: true,
                            message: '请选择组题',
                          }],
                        })(
                          <Select placeholder="请选择组题">
                            {recourseObj}
                          </Select>
                        )}
                      </FormItem>}
                    {getFieldValue('type') == 2 ?<span className={styles.spancenter}>从蓝牙任务中选择自定义组题</span> : null}
                  </div>


                </div> : null}

            </div>
            <span style={{width: '100%', display: 'block', textAlign: 'center', marginTop: '20px'}}>
                  <Button type="primary" htmlType="submit" style={{marginRight: '20px', padding: '0 50px'}}>保存</Button>
                  <Button htmlType="submit" onClick={this.handleGoBack} style={{padding: '0 50px'}}>取消</Button>
                </span>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
