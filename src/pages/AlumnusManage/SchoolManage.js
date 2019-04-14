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
import SchoolManageTable from '../../components/AlumnusManage/SchoolManageTable.js';
import Inputval from '../../components/QueryConditionItem/Inputval.js';
import BtnSearch from '../../components/QueryConditionItem/BtnSearch.js';
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
  alumnusManage: state.alumnusManage,
}))
@Form.create()
export default class SchoolManage extends Component {
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
      type: 'alumnusManage/getClassifyList',
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
      type: 'alumnusManage/getClassifyList',
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
        type: 'alumnusManage/getClassifyList',
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
        type: 'alumnusManage/getClassifyItem',
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
          type: 'alumnusManage/uptClassifyData',
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
          type: 'alumnusManage/addClassifyData',
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
          type: 'alumnusManage/delClassifyData',
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
              type: 'alumnusManage/delClassifyData',
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
      case 'normal':
        confirm({
          title: '',
          content: '是否确认删除？',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            dispatch({
              type: 'alumnusManage/delClassifyData',
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
      case 'disabled':
        confirm({
          title: '',
          content: '是否确认删除？',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            dispatch({
              type: 'alumnusManage/delClassifyData',
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

  handleTabChange = key => {
    const { dispatch } = this.props;
    switch (key) {
      case 'autographManage':
        dispatch(routerRedux.push('/alumnusManage/autograph-manage'));
        break;
      case 'schoolManage':
        dispatch(routerRedux.push('/alumnusManage/school-manage'));
        break;
      case 'backgroundManage':
        dispatch(routerRedux.push('/alumnusManage/background-manage'));
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
        <Inputval dispatch={this.props} dataInx={'titleS'} con={'姓名'} innerCon={'请输入姓名'} maxLength={'15'}
                  size={{lg: 12, xl: 8, xxl: 6}}/>

        <BtnSearch dispatch={this.props} con={'搜索'} size={{lg: 12, xl: 8, xxl: 1}}/>
        <Col id={'mediaXl'}>
          <Button type="primary" style={{marginLeft: '10px'}} onClick={() => this.addShow(null, null)}><Icon
            type="plus-circle"/>校友录</Button>
          <Button type="primary" style={{marginLeft: '10px'}} onClick={() => this.addShow(null, null)}><Icon
            type="plus-circle"/>头像导入</Button>
          <Button type="primary" style={{marginLeft: '10px'}} onClick={() => this.addShow(null, null)}><Icon
            type="plus-circle"/>模板下载</Button>
          <Button type="primary" style={{marginLeft: '10px'}} onClick={() => this.addShow(null, null)}><Icon
            type="plus-circle"/>批量导入</Button>
          <Button type="primary" style={{marginLeft: '10px'}} onClick={() => this.addShow(null, null)}><Icon
            type="plus-circle"/>新增</Button>
        </Col>
      </Form>

    );

  }

  render() {
    const {alumnusManage: {loading: ruleLoading, classifyData, classifyItem}, form: {getFieldDecorator}} = this.props;
    const {addVisible, addModalTitle, addModalType, imageUrl} = this.state;
    const formItemLayout = {
      labelcol: {span: 6},
      wrappercol: {
        xs: {span: 28, offset: 0},
        sm: {span: 10, offset: 0},
      },
    };

    let tabList = [
      { key: 'autographManage', tab: '校园校友' },
      { key: 'schoolManage', tab: '校友签名' },
      { key: 'backgroundManage', tab: '签名背景' },
    ];
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="del">批量删除</Menu.Item>
        <Menu.Item key="normal">批量正常</Menu.Item>
        <Menu.Item key="disabled">批量禁用</Menu.Item>
      </Menu>
    );
    return (
      <PageHeaderLayout
        tabList={tabList}
        activeIndex={1}
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

            <SchoolManageTable
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
            <FormItem label="姓名" {...formItemLayout}>
              {getFieldDecorator('title', {
                  initialValue: addModalType === 'edit' && classifyItem ? classifyItem.title : '',
                  rules: [{
                    required: true,
                    message: '请输入姓名',
                  }],
                },
              )(
                <Input placeholder={'请输入姓名'} maxLength="100"/>
              )}
            </FormItem>
            <FormItem label="年龄" {...formItemLayout}>
              {getFieldDecorator('sort', {
                  initialValue: addModalType === 'edit' && classifyItem && classifyItem.sort? classifyItem.sort + '' : '',
                  rules: [{
                    type: 'string', pattern: '^\\d+$', message: '只能是数字',
                  }],
                },
              )(
                <Input placeholder={'请输入年龄'} maxLength="10"/>
              )}
            </FormItem>
            <FormItem label="院系" {...formItemLayout}>
              {getFieldDecorator('content', {
                  initialValue: addModalType === 'edit' && classifyItem ? classifyItem.content : '',
                },
              )(
                <Input placeholder={'请输入院系'} maxLength="100"/>
              )}
            </FormItem>
            <FormItem label="简介" {...formItemLayout}>
              {getFieldDecorator('content', {
                  initialValue: addModalType === 'edit' && classifyItem ? classifyItem.content : '',
                },
              )(
                <Input placeholder={'请输入简介'} maxLength="100"/>
              )}
            </FormItem>
            <FormItem label="荣誉" {...formItemLayout}>
              {getFieldDecorator('content', {
                  initialValue: addModalType === 'edit' && classifyItem ? classifyItem.content : '',
                },
              )(
                <Input placeholder={'请输入荣誉'} maxLength="100"/>
              )}
            </FormItem>
            <FormItem label="头像" {...formItemLayout}>
              {getFieldDecorator('previewImageUrl', {
                initialValue:
                  addModalType === 'edit' && classifyItem && classifyItem.previewImageUrl
                    ? classifyItem.previewImageUrl
                    : '',
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
                    <img src={imageUrl} alt="avatar"/>
                  ) : addModalType === 'edit' && classifyItem && classifyItem.previewImageUrl ? (
                    <img src={classifyItem.previewImageUrl} alt="avatar"/>
                  ) : (
                    <div>
                      <Icon type={this.state.loading ? 'loading' : 'plus'}/>
                      <div className="ant-upload-text">Upload</div>
                    </div>
                  )}
                </Upload>,
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
