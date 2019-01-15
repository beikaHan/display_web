import React, { Component } from 'react';
import { connect } from 'dva';
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
import { routerRedux } from 'dva/router';
import PicManageTable from '../../components/TeachingManage/PicManageTable.js';
import Inputval from '../../components/QueryConditionItem/Inputval.js';
import BtnSearch from '../../components/QueryConditionItem/BtnSearch.js';
import DateAndTime from '../../components/QueryConditionItem/DateAndTime.js';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import { getCookie } from '../../utils';
import url from '../../utils/ipconfig';
import styles from './Manage.less';
import moment from 'moment';
import DropDown from '../../components/QueryConditionItem/DropDown';

const confirm = Modal.confirm;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

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
  teachingManage: state.teachingManage,
}))
@Form.create()
export default class VideoManage extends Component {
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
    thumbnailResourceId: '',
    resourceId: '',
    imageUrl: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { pagination, formValues } = this.state;
    dispatch({
      type: 'teachingManage/getClassifyAll',
    });
    dispatch({
      type: 'teachingManage/getSchoolMaterialList',
      payload: {
        ...pagination,
        ...formValues,
        type: 2,
      },
    });
  }

  handleStandardTableChange = pagination => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const params = {
      ...formValues,
      page: pagination.current,
      rows: pagination.pageSize,
      type: 2,
    };
    this.setState({
      pagination: {
        rows: pagination.pageSize,
        page: pagination.current,
      },
    });
    dispatch({
      type: 'teachingManage/getSchoolMaterialList',
      payload: params,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { pagination } = this.state;
    form.validateFields(['titleS', 'classifyIdS'], (err, fieldsValue) => {
      // if (err) return;
      const values = {
        ...fieldsValue,
        ...pagination,
        page: 1,
        type: 2,
      };
      this.setState({
        formValues: values,
        pagination: {
          ...pagination,
          page: 1,
        },
      });

      dispatch({
        type: 'teachingManage/getSchoolMaterialList',
        payload: values,
      });
    });
  };

  handleSelectRows = rows => {
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
        type: 'teachingManage/getSchoolMaterialItem',
        payload: {
          id: item.id,
          type: 2,
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
      thumbnailResourceId: '',
      resourceId: '',
      imageUrl: '',
    });
    this.props.dispatch({
      type: 'teachingManage/saveCP',
      payload: {
        picItem: {},
      },
    });
  };
  add = () => {
    const { dispatch, form } = this.props;
    const {
      addModalItem,
      addModalType,
      pagination,
      formValues,
      thumbnailResourceId,
      resourceId,
    } = this.state;
    let title = '',
      that = this;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let values = {};
      if (addModalType === 'edit') {
        if (
          (thumbnailResourceId == undefined || thumbnailResourceId == '') &&
          (addModalItem.thumbnailResourceId == undefined || addModalItem.thumbnailResourceId == '')
        ) {
          notification.error({
            message: '请上传图片',
          });
          return;
        }
        values = {
          ...fieldsValue,
          id: addModalItem.id,
          adminUserId: addModalItem.adminUserId,
          thumbnailResourceId:
            thumbnailResourceId && thumbnailResourceId != ''
              ? thumbnailResourceId
              : addModalItem.thumbnailResourceId,
          resourceId: resourceId && resourceId != '' ? resourceId : addModalItem.resourceId,
          type: 2,
        };
        delete values.titleS;
        delete values.classifyIdS;
        delete values.previewImageUrl;
        dispatch({
          type: 'teachingManage/uptSchoolMaterialData',
          payload: {
            values: { ...values },
            searchVal: {
              ...formValues,
              ...pagination,
              type: 2,
            },
          },
          callback: () => {
            that.addHide();
          },
        });
      } else {
        if (thumbnailResourceId == undefined || thumbnailResourceId == '') {
          notification.error({
            message: '请上传图片',
          });
          return;
        }
        values = {
          ...fieldsValue,
          thumbnailResourceId:
            thumbnailResourceId && thumbnailResourceId != ''
              ? thumbnailResourceId
              : fieldsValue.thumbnailResourceId,
          resourceId: resourceId && resourceId != '' ? resourceId : fieldsValue.resourceId,
          type: 2,
        };
        delete values.titleS;
        delete values.classifyIdS;
        delete values.previewImageUrl;
        dispatch({
          type: 'teachingManage/addSchoolMaterialData',
          payload: {
            values: { ...values },
            searchVal: {
              ...pagination,
              page: 1,
              type: 2,
            },
          },
          callback: () => {
            that.addHide();
          },
        });
      }
    });
  };
  delInfo = item => {
    const that = this;
    const { dispatch } = this.props;
    const { formValues, pagination } = this.state;
    confirm({
      title: '',
      content: '是否确认删除？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'teachingManage/delSchoolMaterialData',
          payload: {
            ids: [item.id],
            searchVal: {
              ...formValues,
              ...pagination,
              type: 2,
            },
          },
        });
      },
      onCancel() {},
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { formValues, selectedRows, pagination } = this.state;
    const that = this;
    if (!selectedRows || selectedRows.length <= 0) return;
    switch (e.key) {
      case 'del':
        confirm({
          title: '',
          content: '是否确认删除？',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            dispatch({
              type: 'teachingManage/delSchoolMaterialData',
              payload: {
                ids: selectedRows.map(row => row.id),
                searchVal: {
                  ...formValues,
                  ...pagination,
                  type: 2,
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
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };
  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      console.log(info.file.response);
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
          resourceId: info.file.response.resource.id,
          thumbnailResourceId: info.file.response.resource.id,
        })
      );
    }
  };
  handleTabChange = key => {
    const { dispatch } = this.props;
    switch (key) {
      case 'classifiedManage':
        dispatch(routerRedux.push('/teachingManage/classified-manage'));
        break;
      case 'videoManage':
        dispatch(routerRedux.push('/teachingManage/video-manage'));
        break;
      case 'picManage':
        dispatch(routerRedux.push('/teachingManage/pic-manage'));
        break;
      case 'audioManage':
        dispatch(routerRedux.push('/teachingManage/audio-manage'));
        break;
      case 'documentManage':
        dispatch(routerRedux.push('/teachingManage/document-manage'));
        break;
      default:
        break;
    }
  };

  renderForm() {
    const {
      teachingManage: { classifyAllData },
    } = this.props;
    let recourseObj = [];
    classifyAllData &&
      classifyAllData.map(el => {
        recourseObj.push(
          <Option value={el.id} key={el.id}>
            {el.title}
          </Option>
        );
      });
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Inputval
          dispatch={this.props}
          dataInx={'titleS'}
          con={'标题'}
          innerCon={'请输入标题'}
          maxLength={'15'}
          size={{ lg: 12, xl: 8, xxl: 6 }}
        />
        <DropDown
          dispatch={this.props}
          size={{ lg: 12, xl: 8, xxl: 6 }}
          dataInx={'classifyIdS'}
          con={'分类搜索'}
          innerCon={'全部'}
          optObj={recourseObj}
        />
        <BtnSearch dispatch={this.props} con={'搜索'} size={{ lg: 12, xl: 8, xxl: 1 }} />
        <Col id={'mediaXl'}>
          <Button type="primary" style={{ marginLeft: '10px' }} onClick={() => this.addShow()}>
            <Icon type="plus-circle" />
            新增
          </Button>
        </Col>
      </Form>
    );
  }

  render() {
    const {
      teachingManage: { loading: ruleLoading, picData, picItem, classifyAllData },
      form: { getFieldDecorator },
    } = this.props;
    const { addVisible, addModalTitle, addModalType, imageUrl } = this.state;
    const formItemLayout = {
      labelcol: { span: 6 },
      wrappercol: {
        xs: { span: 28, offset: 0 },
        sm: { span: 10, offset: 0 },
      },
    };
    let classifyObj = [];
    classifyAllData &&
      classifyAllData.map(el => {
        classifyObj.push(
          <Option value={el.id} key={el.id}>
            {el.title}
          </Option>
        );
      });
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="del">批量删除</Menu.Item>
      </Menu>
    );
    let tabList = [
      { key: 'classifiedManage', tab: '分类管理' },
      { key: 'videoManage', tab: '视频管理' },
      { key: 'picManage', tab: '图片管理' },
      { key: 'audioManage', tab: '音频管理' },
      { key: 'documentManage', tab: '文档管理' },
    ];
    return (
      <PageHeaderLayout tabList={tabList} activeIndex={2} onTabChange={this.handleTabChange}>
        <Card bordered={false}>
          <div className={styles.classManageList}>
            <div className={styles.classManageListForm}>
              {this.renderForm()}
              <Col lg={12} xl={8} xxl={6} className={styles.pointerSpan}>
                <span className={styles.tableListOperator}>
                  <span>
                    <Dropdown overlay={menu}>
                      <Button style={{ width: '150px' }}>
                        批量操作 <Icon type="down" />
                      </Button>
                    </Dropdown>
                  </span>
                </span>
              </Col>
            </div>

            <PicManageTable
              loading={ruleLoading}
              data={picData}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              dispatch={this.props.dispatch}
              uptInfo={this.addShow}
              delInfo={this.delInfo}
              handleInfo={this.handleInfo}
            />
          </div>
        </Card>

        <Modal
          title={addModalTitle}
          visible={addVisible}
          onOk={this.add}
          onCancel={() => this.addHide()}
          className={styles.addModal}
        >
          <Form layout="inline">
            <FormItem label="图片标题" {...formItemLayout}>
              {getFieldDecorator('title', {
                initialValue: addModalType === 'edit' && picItem ? picItem.title : '',
                rules: [
                  {
                    required: true,
                    message: '请输入图片标题',
                  },
                ],
              })(<Input placeholder={'请输入图片标题'} maxLength={100} />)}
            </FormItem>
            <FormItem label="简介" {...formItemLayout}>
              {getFieldDecorator('content', {
                initialValue: addModalType === 'edit' && picItem ? picItem.content : '',
              })(<Input placeholder={'请输入简介'} maxLength={100} />)}
            </FormItem>
            <FormItem label="状态" {...formItemLayout}>
              {getFieldDecorator('status', {
                initialValue: addModalType === 'edit' && picItem ? picItem.status : 1,
              })(
                <RadioGroup>
                  <Radio value={1}>启用</Radio>
                  <Radio value={2}>禁用</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem label="分类" {...formItemLayout}>
              {getFieldDecorator('classifyId', {
                initialValue:
                  addModalType === 'edit' && picItem && picItem.classifyId
                    ? picItem.classifyId
                    : classifyAllData && classifyAllData[0]
                    ? classifyAllData[0].id
                    : '',
                rules: [
                  {
                    required: true,
                    message: '请选择分类',
                  },
                ],
              })(<Select placeholder={'请选择分类'}>{classifyObj}</Select>)}
            </FormItem>
            <FormItem label="学校图片" {...formItemLayout}>
              {getFieldDecorator('thumbnailResourceId', {
                initialValue:
                  addModalType === 'edit' && picItem && picItem.thumbnailResourceId
                    ? picItem.thumbnailResourceId
                    : '',
                rules: [
                  {
                    required: true,
                    message: '学校图片',
                  },
                ],
              })(
                <Upload
                  name="file"
                  listType="picture-card"
                  showUploadList={false}
                  headers={{
                    // 'Content-Type': 'multipart/form-data',
                    JSESSIONID: getCookie() ? getCookie() : null,
                  }}
                  action={`${url.baseURL}/resource/upload`}
                  beforeUpload={beforeUpload}
                  onChange={this.handleChange}
                >
                  {imageUrl ? (
                    <img src={imageUrl} alt="avatar" />
                  ) : addModalType === 'edit' && picItem && picItem.thumbnailUrl ? (
                    <img src={picItem.thumbnailUrl} alt="avatar" />
                  ) : (
                    <div>
                      <Icon type={this.state.loading ? 'loading' : 'plus'} />
                      <div className="ant-upload-text">Upload</div>
                    </div>
                  )}
                </Upload>
              )}
            </FormItem>
            <FormItem label="图片要求" {...formItemLayout}>
              <div>图片仅支持jpg或png格式，且大小不超过2MB，比例为16:9</div>
            </FormItem>
          </Form>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
