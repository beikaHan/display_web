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
  Modal,
  DatePicker,
  TimePicker,
  message,
  Radio,
  Upload,
  notification,
  Menu
} from 'antd';
import {routerRedux} from 'dva/router';
import ClassifiedManageTable from '../../components/TeachingManage/ClassifiedManageTable.js';
import Inputval from '../../components/QueryConditionItem/Inputval.js';
import BtnSearch from '../../components/QueryConditionItem/BtnSearch.js';
import DateAndTime from '../../components/QueryConditionItem/DateAndTime.js';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Manage.less';
import moment from 'moment';
import url from '../../utils/ipconfig';
import {getCookie} from '../../utils';

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
    message.error('You can only upload JPG file!');
  }
  // const isLt2M = file.size / 1024 / 1024 < 2;
  // if (!isLt2M) {
  //   message.error('Image must smaller than 2MB!');
  // }
  // return isJPG && isLt2M;
  return isJPG;
}

@connect(state => ({
  teachingManage: state.teachingManage,
}))
@Form.create()
export default class ClassifyManage extends Component {
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
    thumbnailResourceId: ''
  };

  componentDidMount() {
    const {dispatch} = this.props;
    const {pagination, formValues} = this.state;

    dispatch({
      type: 'teachingManage/getClassifyList',
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
      type: 'teachingManage/getClassifyList',
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
        },
      });

      dispatch({
        type: 'teachingManage/getClassifyList',
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
        type: 'teachingManage/getClassifyItem',
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
    });
  };
  add = () => {
    const {dispatch, form} = this.props;
    const {addModalItem, addModalType, pagination, formValues, thumbnailResourceId} = this.state;
    let title = '', that = this;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let values = {};
      if (addModalType === 'edit') {
        values = {
          ...fieldsValue,
          id: addModalItem.id,
          thumbnailResourceId: thumbnailResourceId,
        };
        delete values.titleS;
        dispatch({
          type: 'teachingManage/uptClassifyData',
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
          thumbnailResourceId: thumbnailResourceId
        };
        delete values.titleS;
        dispatch({
          type: 'teachingManage/addClassifyData',
          payload: {
            values: {...values},
            searchVal: {
              ...pagination,
              page: 1,
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
    const {formValues, pagination} = this.state;
    confirm({
      title: '',
      content: '是否确认删除？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'teachingManage/delClassifyData',
          payload: {
            ids: [item.id],
            searchVal: {
              ...formValues,
              ...pagination,
            },
          },
        });
      },
      onCancel() {
      },
    });

  };

  handleMenuClick = (e) => {
    const {dispatch} = this.props;
    const {formValues, selectedRows, pagination} = this.state;
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
              type: 'teachingManage/delClassifyData',
              payload: {
                ids: selectedRows.map(row => row.id),
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

  handleTabChange = (key) => {
    const {dispatch} = this.props;
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
        thumbnailResourceId: info.file.response.resource.id
      }));
    }
  }

  renderForm() {
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Inputval dispatch={this.props} dataInx={'titleS'} con={'分类'} innerCon={'请输入分类名'} maxLength={'15'}
                  size={{lg: 12, xl: 8, xxl: 6}}/>

        <BtnSearch dispatch={this.props} con={'搜索'} size={{lg: 12, xl: 8, xxl: 1}}/>
        <Col id={'mediaXl'}>
          <Button type="primary" style={{marginLeft: '10px'}} onClick={() => this.addShow(null, null)}><Icon
            type="plus-circle"/>新增</Button>
        </Col>
      </Form>

    );

  }

  render() {
    const {teachingManage: {loading: ruleLoading, classifyData, classifyItem}, form: {getFieldDecorator}} = this.props;
    const {addVisible, addModalTitle, addModalType, imageUrl} = this.state;
    const formItemLayout = {
      labelcol: {span: 6},
      wrappercol: {
        xs: {span: 28, offset: 0},
        sm: {span: 10, offset: 0},
      },
    };

    let tabList = [
      {key: 'classifiedManage', tab: '分类管理'},
      {key: 'videoManage', tab: '视频管理'},
      {key: 'picManage', tab: '图片管理'},
      {key: 'audioManage', tab: '音频管理'},
      {key: 'documentManage', tab: '文档管理'},
    ];
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="del">批量删除</Menu.Item>
      </Menu>
    );
    return (
      <PageHeaderLayout
        tabList={tabList}
        activeIndex={0}
        onTabChange={this.handleTabChange}
      >
        <Card bordered={false}>
          <div className={styles.classManageList}>
            <div className={styles.classManageListForm}>
              {this.renderForm()}
              <Col lg={12} xl={8} xxl={6} className={styles.pointerSpan}>
                <span className={styles.tableListOperator}>
                  <span>
                        <Dropdown overlay={menu}>
                          <Button style={{width: '150px'}}>
                            批量操作 <Icon type="down"/>
                          </Button>
                        </Dropdown>
                      </span>
                </span>
              </Col>
            </div>

            <ClassifiedManageTable
              loading={ruleLoading}
              data={classifyData}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              dispatch={this.props.dispatch}
              uptInfo={this.addShow}
              delInfo={this.delInfo}
              handleInfo={this.handleInfo}
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
                  initialValue: addModalType === 'edit' && classifyItem ? classifyItem.title : '',
                  rules: [{
                    required: true,
                    message: '请输入名称',
                  }],
                },
              )(
                <Input placeholder={'请输入名称'} maxLength="100"/>
              )}
            </FormItem>
            <FormItem label="描述" {...formItemLayout}>
              {getFieldDecorator('content', {
                  initialValue: addModalType === 'edit' && classifyItem ? classifyItem.content : '',
                },
              )(
                <Input placeholder={'请输入描述'} maxLength="100"/>
              )}
            </FormItem>
            <FormItem label="排序" {...formItemLayout}>
              {getFieldDecorator('sort', {
                  initialValue: addModalType === 'edit' && classifyItem && classifyItem.sort? classifyItem.sort + '' : '',
                  rules: [{
                    type: 'string', pattern: '^\\d+$', message: '只能是数字',
                  }],
                },
              )(
                <Input placeholder={'请输入排序'} maxLength="10"/>
              )}
            </FormItem>
            {/*<FormItem label="缩略图" {...formItemLayout}>*/}
            {/*{getFieldDecorator('previewImageUrl', {*/}
            {/*initialValue: '',*/}
            {/*},*/}
            {/*)(*/}
            {/*<Upload*/}
            {/*name="file"*/}
            {/*listType="picture-card"*/}
            {/*showUploadList={false}*/}
            {/*headers={{*/}
            {/*// 'Content-Type': 'multipart/form-data',*/}
            {/*'JSESSIONID': getCookie() ? getCookie() : null*/}
            {/*}}*/}
            {/*action={`${url.baseURL}/resource/upload`}*/}
            {/*beforeUpload={beforeUpload}*/}
            {/*onChange={this.handleChange}>*/}
            {/*{imageUrl ? <img src={imageUrl} alt="avatar"/> : <div>*/}
            {/*<Icon type={this.state.loading ? 'loading' : 'plus'}/>*/}
            {/*<div className="ant-upload-text">Upload</div>*/}
            {/*</div>}*/}
            {/*</Upload>,*/}
            {/*)}*/}
            {/*</FormItem>*/}
          </Form>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
