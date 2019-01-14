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
import TaskManageTable from '../../components/TaskManage/TaskManageTable.js';
import Inputval from "../../components/QueryConditionItem/Inputval.js";
import BtnSearch from "../../components/QueryConditionItem/BtnSearch.js";
import DateAndTime from "../../components/QueryConditionItem/DateAndTime.js";
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Manage.less';
import moment from 'moment';
import DropDown from '../../components/QueryConditionItem/DropDown';
import Add from '../../components/TaskManage/Add';

const confirm = Modal.confirm;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const {Option} = Select;
const {TextArea} = Input;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  taskManage: state.taskManage
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
    resourceData: [{
      key: 0,
      type: 1,
      relationId: null,
      resourceId: null,

      isDirectShow: null
    }],
    itemId: null,

  };

  componentDidMount() {
    const {dispatch} = this.props;
    const {pagination, formValues} = this.state;
    dispatch({
      type: 'taskManage/getTitleAll',
    });
    dispatch({
      type: 'taskManage/getRecourseList',
    });
    dispatch({
      type: 'taskManage/getSchoolMissionList',
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
      type: 'taskManage/getSchoolMissionList',
      payload: params,
    });
  };

  handleSearch = (e) => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    const {pagination} = this.state;
    form.validateFields(["titleS", "levelS"], (err, fieldsValue) => {
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
        type: 'taskManage/getSchoolMissionList',
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
    let title = '', itemId = null, that = this;
    if (type === 'edit') {
      console.log(item);
      title = '编辑', itemId = item.id;
      this.props.dispatch({
        type: 'taskManage/getSchoolMissionItem',
        payload: {
          id: item.id,
        },
        callback: (items) => {
          console.log(items)
          if (items && items.length > 0) {
            that.setState({
              resourceData: items
            })
          }
        }
      });
    } else {
      title = '新增';
    }
    this.setState({
      addVisible: true,
      addModalTitle: title,
      addModalType: type,
      addModalItem: item,
      itemId: itemId
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
      resourceData: [{
        key: 0,
        type: 1,
        relationId: null,
        resourceId: null,
        isDirectShow: null
      }],
    });
  };
  add = () => {
    let items = this.state.resourceData
    const {dispatch, form} = this.props;
    const {addModalItem, addModalType, pagination, formValues} = this.state;
    let title = '', that = this;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (!fieldsValue.items||fieldsValue.items.length==0) {
        notification.error({
          message: '请添加任务',
        });
        return;
      }
      let values = {};
      if (addModalType === 'edit') {
        values = {
          ...fieldsValue,
          id: that.props.taskManage.schoolMissionItem.id
          // items: items,
        };
        delete values.titleS;
        delete values.levelS;
        dispatch({
          type: 'taskManage/uptSchoolMissionData',
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
          // items: items,
        };
        delete values.titleS;
        delete values.levelS;
        dispatch({
          type: 'taskManage/addSchoolMissionData',
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
          type: 'taskManage/delSchoolMissionData',
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
    if (!selectedRows) return;
    switch (e.key) {
      case 'del':
        confirm({
          title: '',
          content: '是否确认删除？',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            dispatch({
              type: 'taskManage/delSchoolMissionData',
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
  changeUploadList = (type, key, el) => {
    let resourceData = this.state.resourceData && this.state.resourceData.length > 0 ? this.state.resourceData.slice(0) : []
    if (type === 'plus') {
      let temp = 0;
      for (let i = 0; i < resourceData.length; i++) {
        if (i === 0) {
          temp = resourceData[i].key
        } else {
          if (resourceData[i].key > resourceData[i - 1].key) {
            temp = resourceData[i].key
          } else {
            temp = resourceData[i - 1].key
          }
        }

      }
      resourceData.push({
        ...el,
        key: temp + 1,
        type: 1,
        relationId: null,
        resourceId: null,
        isDirectShow: null
      })
    } else {
      for (let i = 0; i < resourceData.length; i++) {
        if (key === resourceData[i].key) {
          resourceData.splice(i, 1)
          break;
        }
      }
    }
    this.setState({
      resourceData: resourceData
    })
  };
  onUploadChange = (val, key) => {
    this.props.dispatch({
      type: 'taskManage/getRecourseList',
      payload: {
        type: val
      }
    });
    // let resourceData = this.state.resourceData && this.state.resourceData.length > 0 ? this.state.resourceData.slice(0) : []
    // for (let i = 0; i < resourceData.length; i++) {
    //   if (key === resourceData[i].key) {
    //     resourceData[i].type = val
    //     break;
    //   }
    // }
    // this.setState({
    //   resourceData: resourceData
    // })
  };
  onSwitchChange = (val, key) => {
    console.log(val)
    let resourceData = this.state.resourceData && this.state.resourceData.length > 0 ? this.state.resourceData.slice(0) : []
    for (let i = 0; i < resourceData.length; i++) {
      if (key === resourceData[i].key) {
        resourceData[i].isDirectShow = val ? 1 : 2
        break;
      }
    }
    this.setState({
      resourceData: resourceData
    })
  };
  onTextChange = (val, key) => {
    let resourceData = this.state.resourceData && this.state.resourceData.length > 0 ? this.state.resourceData.slice(0) : []
    for (let i = 0; i < resourceData.length; i++) {
      if (key === resourceData[i].key) {
        resourceData[i].relationId = val
        break;
      }
    }
    this.setState({
      resourceData: resourceData
    })
  };
  handleresourceChange = (info, key, type) => {
    let resourceData = this.state.resourceData && this.state.resourceData.length > 0 ? this.state.resourceData.slice(0) : []

    if (info.file.status === 'uploading') {
      this.setState({loading: true});
      return;
    }
    if (info.file.status === 'done') {
      console.log(info.file.response)
      for (let i = 0; i < resourceData.length; i++) {
        if (key === resourceData[i].key) {
          resourceData[i].type = type;
          resourceData[i].key = key;
          resourceData[i].resourceId = info.file.response.resource.id;
          break;
        }
      }
      console.log(resourceData)
      this.setState({
        loading: false,
        resourceData: resourceData
      })
    }
  }

  renderForm() {
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Inputval dispatch={this.props} dataInx={'titleS'} con={'标题'} innerCon={'请输入标题'} maxLength={'15'}
                  size={{lg: 12, xl: 8, xxl: 6}}/>
        <DropDown dispatch={this.props} size={{lg: 12, xl: 7, xxl: 5}} dataInx={'levelS'} con={'难易度'} innerCon={'全部'}
                  optObj={[
                    <Option key={`1`} value={'1'}>{'简单'}</Option>,
                    <Option key={`2`} value={'2'}>{'正常'}</Option>,
                    <Option key={`3`} value={'3'}>{'困难'}</Option>,
                  ]}/>
        <BtnSearch dispatch={this.props} con={'搜索'} size={{lg: 1, xl: 1, xxl: 1}}/>
        <Col id={'mediaXl'}>
          <Button type="primary" style={{marginLeft: '10px'}} onClick={() => this.addShow()}><Icon
            type="plus-circle"/>新增</Button>
        </Col>
      </Form>

    );
  }

  render() {
    const {taskManage: {loading: ruleLoading, schoolMissionData, schoolMissionItem, titleAll, recourseList}, form: {getFieldDecorator}} = this.props;
    const {addVisible, addModalTitle, itemId, resourceData} = this.state;
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
    return (
      <PageHeaderLayout title="任务管理">
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

            <TaskManageTable
              loading={ruleLoading}
              data={schoolMissionData}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              dispatch={this.props.dispatch}
              uptInfo={this.addShow}
              delInfo={this.delInfo}
              handleInfo={this.handleInfo}
            />
          </div>
        </Card>

        {/*新增编辑*/}
        {addVisible ? <Add
          dispatch={this.props}
          addVisible={addVisible}
          addShow={this.addShow}
          addHide={this.addHide}
          addModalTitle={addModalTitle}
          add={this.add}
          itemId={itemId}
          itemDetails={schoolMissionItem}
          items={resourceData}
          recourseList={recourseList}
          changeUploadList={this.changeUploadList}
          onUploadChange={this.onUploadChange}
          handleresourceChange={this.handleresourceChange}
          onTextChange={this.onTextChange}
          onSwitchChange={this.onSwitchChange}
          titleAll={titleAll}
        /> : ''}
      </PageHeaderLayout>
    );
  }
}
