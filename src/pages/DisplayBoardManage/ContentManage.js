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
import ContentManageTable from '../../components/DisplayBoardManage/ContentManageTable.js';
import Inputval from '../../components/QueryConditionItem/Inputval.js';
import BtnSearch from '../../components/QueryConditionItem/BtnSearch.js';
import Add from '../../components/DisplayBoardManage/Add.js';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

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

@connect(state => ({
  displayBoardManage: state.displayBoardManage,
}))
@Form.create()
export default class ContentManage extends Component {
  state = {
    formValues: {},
    pagination: {
      rows: 10,
      page: 1,
    },
    addModalTitle: '',
    addModalType: '',
    addModalItem: '',
    itemId: null,
    addVisible: false,
    selectedRows: [],
    resourceData: [
      {
        key: 0,
        type: 1,
        resourceId: null,
      },
    ],
    uploading: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { pagination, formValues } = this.state;
    const that = this;
    dispatch({
      type: 'displayBoardManage/getClassifyDisplayAll',
    });
    dispatch({
      type: 'displayBoardManage/getContentDisplayList',
      payload: {
        ...pagination,
        ...formValues,
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
    };
    this.setState({
      pagination: {
        rows: pagination.pageSize,
        page: pagination.current,
      },
    });
    dispatch({
      type: 'displayBoardManage/getContentDisplayList',
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
      };
      this.setState({
        formValues: values,
        pagination: {
          ...pagination,
          page: 1,
        },
      });

      dispatch({
        type: 'displayBoardManage/getContentDisplayList',
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
    let title = '',
      itemId = null;
    const that = this;
    if (type === 'edit') {
      console.log(item);
      (title = '编辑'), (itemId = item.id);
      this.props.dispatch({
        type: 'displayBoardManage/getContentDisplayItem',
        payload: {
          id: item.id,
        },
        callback: items => {
          console.log(items);
          if (items && items.length > 0) {
            that.setState({
              resourceData: items,
            });
          }
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
      itemId: itemId,
    });
  };
  addHide = () => {
    this.props.form.resetFields();
    this.setState({
      addVisible: false,
      addModalTitle: '',
      addModalType: '',
      addModalItem: '',
      itemId: null,
      resourceData: [
        {
          key: 0,
          type: 1,
          resourceId: null,
        },
      ],
      uploading: {},
    });
  };
  add = thumbnailResourceId => {
    let items = this.state.resourceData;
    const { dispatch, form } = this.props;
    const { addModalItem, addModalType, pagination, formValues } = this.state;
    let title = '',
      that = this;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let values = {};

      for (let i = 0; i < items.length; i++) {
        if (items[i].resourceId == undefined || items[i].resourceId == '') {
          notification.error({
            message: '请上传完整资源',
          });
          return;
        }
      }

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
          items: items,
          thumbnailResourceId:
            thumbnailResourceId && thumbnailResourceId != ''
              ? thumbnailResourceId
              : addModalItem.thumbnailResourceId,
        };
        delete values.titleS;
        delete values.classifyIdS;
        dispatch({
          type: 'displayBoardManage/uptContentDisplayData',
          payload: {
            values: { ...values },
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
        if (thumbnailResourceId == undefined || thumbnailResourceId == '') {
          notification.error({
            message: '请上传图片',
          });
          return;
        }
        values = {
          ...fieldsValue,
          items: items,
          thumbnailResourceId: thumbnailResourceId,
        };
        delete values.titleS;
        delete values.classifyIdS;
        dispatch({
          type: 'displayBoardManage/addContentDisplayData',
          payload: {
            values: { ...values },
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
          type: 'displayBoardManage/delContentDisplayData',
          payload: {
            ids: [item.id],
            searchVal: {
              ...formValues,
              ...pagination,
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
              type: 'displayBoardManage/delContentDisplayData',
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
      case 'qrcode':
        confirm({
          title: '',
          content: '是否确认批量下载二维码？',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            window.open(
              `${url.baseURL}/schoolDisplayBoard/qrcode/batch?ids=${selectedRows.map(
                row => row.id
              )}`
            );
            that.setState({
              selectedRows: [],
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
  handleInfo = item => {
    const that = this;
    const { dispatch } = this.props;
    const { formValues, pagination } = this.state;
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
  };
  handleTabChange = key => {
    const { dispatch } = this.props;
    switch (key) {
      case 'typeManage':
        dispatch(routerRedux.push('/displayBoardManage/type-manage'));
        break;
      case 'contentManage':
        dispatch(routerRedux.push('/displayBoardManage/content-manage'));
        break;
      default:
        break;
    }
  };
  downloadQrcode = item => {
    window.open(`${url.baseURL}/schoolDisplayBoard/qrcode/${item.id}`);
  };
  changeUploadList = (type, key) => {
    let resourceData =
      this.state.resourceData && this.state.resourceData.length > 0
        ? this.state.resourceData.slice(0)
        : [];
    if (type === 'plus') {
      let temp = 0;
      for (let i = 0; i < resourceData.length; i++) {
        if (i === 0) {
          temp = resourceData[i].key;
        } else {
          if (resourceData[i].key > resourceData[i - 1].key) {
            temp = resourceData[i].key;
          } else {
            temp = resourceData[i - 1].key;
          }
        }
      }
      resourceData.push({
        key: temp + 1,
        type: 1,
        resourceId: null,
      });
    } else {
      if (resourceData.length <= 1) {
        notification.success({
          message: '至少保留一项',
        });
        return;
      }
      for (let i = 0; i < resourceData.length; i++) {
        if (key === resourceData[i].key) {
          resourceData.splice(i, 1);
          break;
        }
      }
    }
    this.setState({
      resourceData: resourceData,
    });
  };
  onUploadChange = (val, key) => {
    let resourceData =
      this.state.resourceData && this.state.resourceData.length > 0
        ? this.state.resourceData.slice(0)
        : [];
    for (let i = 0; i < resourceData.length; i++) {
      if (key === resourceData[i].key) {
        resourceData[i].type = val;
        break;
      }
    }
    this.setState({
      resourceData: resourceData,
    });
  };
  handleresourceChange = (info, key, type) => {
    let resourceData =
      this.state.resourceData && this.state.resourceData.length > 0
        ? this.state.resourceData.slice(0)
        : [];
    let uploading = this.state.uploading;
    if (info.file.status === 'uploading') {
      uploading[key] = true;
      this.setState({ uploading: uploading });
      return;
    }
    if (info.file.status === 'done') {
      console.log(info.file.response);
      for (let i = 0; i < resourceData.length; i++) {
        if (key === resourceData[i].key) {
          resourceData[i].type = type;
          resourceData[i].key = key;
          resourceData[i].resourceId = info.file.response.resource.id;
          uploading[key] = false;
          break;
        }
      }
      console.log(resourceData);
      this.setState({
        uploading: uploading,
        resourceData: resourceData,
      });
    }
  };

  renderForm() {
    const {
      displayBoardManage: { classifyDisplayAll },
    } = this.props;
    let recourseObj = [];
    classifyDisplayAll &&
      classifyDisplayAll.map(el => {
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
      displayBoardManage: {
        loading: ruleLoading,
        contentDisplayData,
        contentDisplayItem,
        classifyDisplayAll,
        items,
      },
      form: { getFieldDecorator },
    } = this.props;

    const {
      addVisible,
      addModalTitle,
      addModalType,
      itemId,
      itemDetails,
      resourceData,
      uploading,
    } = this.state;
    console.log(resourceData);
    const formItemLayout = {
      labelcol: { span: 6 },
      wrappercol: {
        xs: { span: 28, offset: 0 },
        sm: { span: 10, offset: 0 },
      },
    };
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="del">批量删除</Menu.Item>
        <Menu.Item key="qrcode">批量下载二维码</Menu.Item>
      </Menu>
    );

    let tabList = [
      { key: 'typeManage', tab: '分类管理' },
      { key: 'contentManage', tab: '内容管理' },
    ];
    return (
      <PageHeaderLayout tabList={tabList} activeIndex={1} onTabChange={this.handleTabChange}>
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

            <ContentManageTable
              loading={ruleLoading}
              data={contentDisplayData}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              dispatch={this.props.dispatch}
              uptInfo={this.addShow}
              delInfo={this.delInfo}
              handleInfo={this.handleInfo}
              itemId={itemId}
              downloadQrcode={this.downloadQrcode}
            />
          </div>
        </Card>

        {/*新增编辑*/}
        {addVisible ? (
          <Add
            dispatch={this.props}
            addVisible={addVisible}
            addShow={this.addShow}
            addHide={this.addHide}
            addModalTitle={addModalTitle}
            add={this.add}
            itemId={itemId}
            itemDetails={contentDisplayItem}
            classifyDisplayAll={classifyDisplayAll}
            items={resourceData}
            changeUploadList={this.changeUploadList}
            onUploadChange={this.onUploadChange}
            handleresourceChange={this.handleresourceChange}
            uploading={uploading}
          />
        ) : (
          ''
        )}
      </PageHeaderLayout>
    );
  }
}
