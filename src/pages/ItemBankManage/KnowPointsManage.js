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
import {routerRedux} from "dva/router";
import KnowPointsManageTable from '../../components/ItemBankManage/KnowPointsManageTable.js';
import Inputval from "../../components/QueryConditionItem/Inputval.js";
import BtnSearch from "../../components/QueryConditionItem/BtnSearch.js";
import DateAndTime from "../../components/QueryConditionItem/DateAndTime.js";
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import {getCookie} from '../../utils';
import url from '../../utils/ipconfig';
import styles from './Manage.less';
import moment from 'moment';

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
  itemBankManage: state.itemBankManage,
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
    thumbnailResourceId: ''
  };

  componentDidMount() {
    const {dispatch} = this.props;
    const {pagination, formValues} = this.state;

    dispatch({
      type: 'itemBankManage/getSchoolQuestionTopicList',
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
      type: 'itemBankManage/getSchoolQuestionTopicList',
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
        type: 'itemBankManage/getSchoolQuestionTopicList',
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
        type: 'itemBankManage/getSchoolQuestionTopicItem',
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
          adminUserId: addModalItem.adminUserId,
          thumbnailResourceId: thumbnailResourceId
        };
        delete values.titleS;
        delete values.previewImageUrl;

        dispatch({
          type: 'itemBankManage/uptSchoolQuestionTopicData',
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
        delete values.previewImageUrl;

        dispatch({
          type: 'itemBankManage/addSchoolQuestionTopicData',
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
          type: 'itemBankManage/delSchoolQuestionTopicData',
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
              type: 'itemBankManage/delSchoolQuestionTopicData',
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
  handleInfo = (item) => {
    const that = this;
    const {dispatch} = this.props;
    const {formValues, pagination} = this.state;
    dispatch({
      type: 'manage/uptSchoolData',
      payload: {
        ...item,
        status: item.status == 2 ? 1 : 2,
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
        thumbnailResourceId: info.file.response.resource.id
      }));
    }
  }
  handleTabChange = (key) => {
    const {dispatch} = this.props;
    switch (key) {
      case 'knowPointsManage':
        dispatch(routerRedux.push('/itemBankManage/know-points-manage'));
        break;
      case 'itemManage':
        dispatch(routerRedux.push('/itemBankManage/item-manage'));
        break;
      case 'customManage':
        dispatch(routerRedux.push('/itemBankManage/custom-manage'));
        break;
      case 'groupManage':
        dispatch(routerRedux.push('/itemBankManage/group-manage'));
        break;
      default:
        break;
    }
  };

  renderForm() {
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Inputval dispatch={this.props} dataInx={'titleS'} con={'名称'} innerCon={'请输入名称'} maxLength={'15'}
                  size={{lg: 12, xl: 8, xxl: 6}}/>
        <BtnSearch dispatch={this.props} con={'搜索'} size={{lg: 12, xl: 8, xxl: 1}}/>
        <Col id={'mediaXl'}>
          <Button type="primary" style={{marginLeft: '10px'}} onClick={() => this.addShow()}><Icon
            type="plus-circle"/>新增</Button>
        </Col>
      </Form>

    );
  }

  render() {
    const {itemBankManage: {loading: ruleLoading, schoolQuestionTopicData, schoolQuestionTopicItem}, form: {getFieldDecorator}} = this.props;
    const {addVisible, addModalTitle, addModalType, imageUrl} = this.state;
    const formItemLayout = {
      labelcol: {span: 6},
      wrappercol: {
        xs: {span: 28, offset: 0},
        sm: {span: 10, offset: 0},
      },
    };
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="del">批量删除</Menu.Item>
      </Menu>
    );
    let tabList = [
      {key: 'knowPointsManage', tab: '知识点管理'},
      {key: 'itemManage', tab: '题库管理'},
      {key: 'customManage', tab: '自定义组题'},
      {key: 'groupManage', tab: '组题规则'},
    ];
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

            <KnowPointsManageTable
              loading={ruleLoading}
              data={schoolQuestionTopicData}
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
            <FormItem label="标题" {...formItemLayout}>
              {getFieldDecorator('title', {
                  initialValue: addModalType === 'edit' && schoolQuestionTopicItem ? schoolQuestionTopicItem.title : '',
                  rules: [{
                    required: true,
                    message: '请输入标题',
                  }],
                },
              )(
                <Input placeholder={'请输入标题'} maxLength={100}/>,
              )}
            </FormItem>
            <FormItem label="描述" {...formItemLayout}>
              {getFieldDecorator('content', {
                  initialValue: addModalType === 'edit' && schoolQuestionTopicItem ? schoolQuestionTopicItem.content : '',
                },
              )(
                <Input placeholder={'请输入描述'} maxLength={100}/>,
              )}
            </FormItem>
            <FormItem label="排序" {...formItemLayout}>
              {getFieldDecorator('sort', {
                  initialValue: addModalType === 'edit' && schoolQuestionTopicItem && schoolQuestionTopicItem.sort? schoolQuestionTopicItem.sort + '' : null,
                  rules: [{
                    type: 'string', pattern: '^\\d+$', message: '只能是数字',
                  }],
                },
              )(
                <Input placeholder={'请输入排序'} maxLength={100}/>,
              )}
            </FormItem>
            <FormItem label="缩略图" {...formItemLayout}>
              {getFieldDecorator('previewImageUrl', {
                  initialValue: '',
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
                                   alt="avatar"/> : addModalType === 'edit' && schoolQuestionTopicItem && schoolQuestionTopicItem.thumbnailUrl ?
                    <img src={schoolQuestionTopicItem.thumbnailUrl} alt="avatar"/> : <div>
                      <Icon type={this.state.loading ? 'loading' : 'plus'}/>
                      <div className="ant-upload-text">Upload</div>
                    </div>}
                </Upload>,
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
