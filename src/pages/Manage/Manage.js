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
import {routerRedux} from 'dva/router';
import QRCode from 'qrcode.react';
import ManageTable from '../../components/Manage/ManageTable.js';
import Inputval from '../../components/QueryConditionItem/Inputval.js';
import BtnSearch from '../../components/QueryConditionItem/BtnSearch.js';
import DateAndTime from '../../components/QueryConditionItem/DateAndTime.js';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Manage.less';
import moment from 'moment';
import {getSchoolInfo, getCookie} from '../../utils';
import url from '../../utils/ipconfig';

const confirm = Modal.confirm;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const {Option} = Select;
const {TextArea} = Input;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

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
  manage: state.manage,
}))
@Form.create()
export default class VipManage extends Component {
  state = {
    formValues: {},
    pagination: {
      rows: 10,
      page: 1,
    },
    addModalTitle: '',
    addModalType: '',
    addModalItem: '',
    addVisible: false,
    selectedRows: [],
    loading: false,
    imageUrl: '',
    previewImageResourceId: ''
  };

  componentDidMount() {
    const {dispatch} = this.props;
    const {pagination, formValues} = this.state;

    dispatch({
      type: 'manage/getSchoolList',
      payload: {
        ...pagination,
        ...formValues,
      },
    });
  }

  handleStandardTableChange = (pagination) => {
    const {dispatch} = this.props;
    const {formValues} = this.state;

    const params = {
      ...formValues,
      page: pagination.current,
      rows: pagination.pageSize,
    };
    this.setState({
      pagination: {
        rows: pagination.pageSize,
        page: pagination.current,
      },
    });
    dispatch({
      type: 'manage/getSchoolList',
      payload: params,
    });
  };

  handleSearch = (e) => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    const {pagination} = this.state;
    form.validateFields(["titleS"], (err, fieldsValue) => {
      // if (err) return;
      const values = {
        ...fieldsValue,
        ...pagination,
        page: 1,
      };
      this.setState({
        formValues: values,
        pagination: {
          ...pagination,
          page: 1,
        }
      });

      dispatch({
        type: 'manage/getSchoolList',
        payload: values,
      });
    });
  };

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  };

  addShow = (type, item) => {
    let title = '';
    if (type === 'edit') {
      console.log(item);
      title = '编辑';
      this.props.dispatch({
        type: 'manage/getSchoolItem',
        payload: {
          id: item.id,
        },
      });
    } else {
      title = '新增';
    }
    this.setState({
      addVisible: true,
      addModalTitle: title,
      addModalType: type,
      addModalItem: item,
    });
  };
  addHide = () => {
    this.props.form.resetFields();
    this.setState({
      addVisible: false,
      addModalTitle: '',
      addModalType: '',
      addModalItem: '',
      imageUrl: ''
    });
  };
  add = (type, item) => {
    const {dispatch, form} = this.props;
    const {addModalItem, addModalType, pagination, formValues, previewImageResourceId} = this.state;
    let title = '', that = this;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let values = {};
      if (addModalType === 'edit') {
        values = {
          ...fieldsValue,
          id: addModalItem.id,
          adminUserId: addModalItem.adminUserId,
          previewImageResourceId: previewImageResourceId
        };
        delete values.titleS;
        dispatch({
          type: 'manage/uptSchoolData',
          payload: {
            values: {...values},
            searchVal: {
              ...formValues,
              ...pagination,
            },
          },
          callback: () => {
            that.addHide();
          },
        });
      } else {
        values = {
          ...fieldsValue,
          previewImageResourceId: previewImageResourceId
        };
        delete values.titleS;
        dispatch({
          type: 'manage/addSchoolData',
          payload: {
            values: {...values},
            searchVal: {
              ...pagination,
              page: 1
            },
          },
          callback: () => {
            that.addHide();
          },
        });
      }
    });
  };
  delInfo = (item) => {
    const that = this;
    const {dispatch} = this.props;
    const {formValues, selectedRows, pagination} = this.state;
    console.log(selectedRows);
    confirm({
      title: '',
      content: '是否确认删除？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'manage/delSchoolData',
          payload: {
            ids: item ? [item.id] : selectedRows.map(row => row.id),
            searchVal: {
              ...formValues,
              ...pagination,
            },
          },
          callback: () => {
            that.setState({
              selectedRows: [],
            });
          },
        });
      },
      onCancel() {
        that.setState({
          selectedRows: [],
        });
      },
    });

  };

  handleInfo = (item) => {
    const that = this;
    const {dispatch} = this.props;
    const {formValues, pagination} = this.state;
    dispatch({
      type: 'manage/uptSchoolData',
      payload: {
        values: {
          ...item,
          status: item.status == 2 ? 1 : 2,
        },
        searchVal: {
          ...formValues,
          ...pagination,
        },
      },
      callback: () => {
        that.setState({
          selectedRows: [],
        });
      },
    });
  }
  handleChange = (info) => {
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
        previewImageResourceId: info.file.response.resource.id
      }));
    }
  }
  downloadQrcode = (item) => {
    window.open(`${url.baseURL}/schoolBase/qrcode/${item.id}`);
    // location.href = 'http://39.96.18.156:80/schoolBase/qrcode/0'
// this.props.dispatch({
//       type: 'manage/downloadQrcode',
// payload:{
//   schoolId: item.id
// }
//     })
  }

  renderForm() {
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Inputval dispatch={this.props} dataInx={'titleS'} con={'学校名称'} innerCon={'请输入学校名称'} maxLength={'15'}
                  size={{lg: 12, xl: 8, xxl: 6}}/>
        <BtnSearch dispatch={this.props} con={'搜索'} size={{lg: 12, xl: 8, xxl: 1}}/>
        <Col id={'mediaXl'}>
          <Button type="primary" style={{marginLeft: '10px'}} onClick={() => this.addShow(null, null)}><Icon
            type="plus-circle"/>新增</Button>
          <Button type="primary" style={{marginLeft: '10px'}} onClick={() => this.delInfo()}><Icon
            type="plus-circle"/>批量删除</Button>
        </Col>
      </Form>

    );
  }

  render() {
    const {manage: {loading: ruleLoading, manageData, schoolItem}, form: {getFieldDecorator}} = this.props;
    const {addVisible, addModalTitle, addModalType, imageUrl} = this.state;
    const formItemLayout = {
      labelcol: {span: 6},
      wrappercol: {
        xs: {span: 28, offset: 0},
        sm: {span: 10, offset: 0},
      },
    };
// console.log(getCookie())
    return (
      <PageHeaderLayout
        title='学校管理'
      >
        <Card bordered={false}>
          <div className={styles.classManageList}>
            <div className={styles.classManageListForm}>
              {this.renderForm()}
            </div>

            <ManageTable
              loading={ruleLoading}
              data={manageData}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              dispatch={this.props.dispatch}
              uptInfo={this.addShow}
              delInfo={this.delInfo}
              handleInfo={this.handleInfo}
              downloadQrcode={this.downloadQrcode}
            />
          </div>
        </Card>

        <Modal title={addModalTitle}
               visible={addVisible}
               onOk={this.add}
               onCancel={() => this.addHide()}
               className={styles.addModal}
        >
          <Form layout="inline">
            <FormItem label="名称" {...formItemLayout}>
              {getFieldDecorator('title', {
                  initialValue: addModalType === 'edit' && schoolItem ? schoolItem.title : '',
                  rules: [{
                    required: true,
                    message: '请输入名称',
                  }],
                },
              )(
                <Input placeholder={'请输入名称'} maxLength={100}/>,
              )}
            </FormItem>
            <FormItem label="网址" {...formItemLayout}>
              {getFieldDecorator('websiteUrl', {
                  initialValue: addModalType === 'edit' && schoolItem ? schoolItem.websiteUrl : '',
                },
              )(
                <Input placeholder={'请输入网址'} maxLength={100}/>,
              )}
            </FormItem>
            <FormItem label="联系方式" {...formItemLayout}>
              {getFieldDecorator('contact', {
                  initialValue: addModalType === 'edit' && schoolItem ? schoolItem.contact : '',
                },
              )(
                <Input placeholder={'请输入联系方式'} maxLength={100}/>,
              )}
            </FormItem>
            <FormItem label="简介" {...formItemLayout}>
              {getFieldDecorator('content', {
                  initialValue: addModalType === 'edit' && schoolItem ? schoolItem.content : '',
                },
              )(
                <Input placeholder={'请输入简介'} maxLength={100}/>,
              )}
            </FormItem>
            <FormItem label="地址" {...formItemLayout}>
              {getFieldDecorator('address', {
                  initialValue: addModalType === 'edit' && schoolItem ? schoolItem.address : '',
                },
              )(
                <Input placeholder={'请输入地址'} maxLength={100}/>,
              )}
            </FormItem>
            <FormItem label="账号" {...formItemLayout}>
              {getFieldDecorator('username', {
                  initialValue: addModalType === 'edit' && schoolItem ? schoolItem.username : '',
                  rules: [{
                    required: true,
                    message: '请输入账号',
                  }],
                },
              )(
                <Input placeholder={'请输入账号'} maxLength={100}/>,
              )}
            </FormItem>
            <FormItem label="密码" {...formItemLayout}>
              {getFieldDecorator('password', {
                  initialValue: addModalType === 'edit' && schoolItem ? schoolItem.password : '',
                  rules: [{
                    required: true,
                    message: '请输入密码',
                  }],
                },
              )(
                <Input placeholder={'请输入密码'} maxLength={100}/>,
              )}
            </FormItem>
            <FormItem label="状态" {...formItemLayout}>
              {getFieldDecorator('status', {
                  initialValue: addModalType === 'edit' && schoolItem ? schoolItem.status : 1,
                },
              )(
                <RadioGroup>
                  <Radio value={1}>启用</Radio>
                  <Radio value={2}>禁用</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem label="学校图片" {...formItemLayout}>
              {getFieldDecorator('previewImageUrl', {
                  initialValue: addModalType === 'edit' && schoolItem && schoolItem.previewImageUrl ? schoolItem.previewImageUrl : '',
                },
              )(
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
                  onChange={this.handleChange}>
                  {imageUrl ? <img src={imageUrl}
                                   alt="avatar"/> : addModalType === 'edit' && schoolItem && schoolItem.previewImageUrl ?
                    <img src={schoolItem.previewImageUrl} alt="avatar"/> : <div>
                      <Icon type={this.state.loading ? 'loading' : 'plus'}/>
                      <div className="ant-upload-text">Upload</div>
                    </div>}
                </Upload>
              )}
            </FormItem>
            <FormItem label="图片要求" {...formItemLayout}>
            <div>仅支持jpg或png格式，且大小不超过2MB</div>
            </FormItem>
          </Form>
        </Modal>

      </PageHeaderLayout>
    );
  }
}
