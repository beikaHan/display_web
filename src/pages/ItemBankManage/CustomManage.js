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
import CustomManageTable from '../../components/ItemBankManage/CustomManageTable.js';
import Inputval from "../../components/QueryConditionItem/Inputval.js";
import BtnSearch from "../../components/QueryConditionItem/BtnSearch.js";
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Manage.less';
import moment from 'moment';
import DropDown from '../../components/QueryConditionItem/DropDown';
import AddCustom from '../../components/ItemBankManage/AddCustom';
import url from '../../utils/ipconfig';

const confirm = Modal.confirm;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const {Option} = Select;
const {TextArea} = Input;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

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
    resourceData: [],
    itemId: ''
  };

  componentDidMount() {
    const {dispatch} = this.props;
    const {pagination, formValues} = this.state;
    dispatch({
      type: 'itemBankManage/getSchoolQuestionTopicAll',
    });
    dispatch({
      type: 'itemBankManage/getSchoolQuestionBankAll',
    });
    dispatch({
      type: 'itemBankManage/getSchoolCustomTestList',
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
      type: 'itemBankManage/getSchoolCustomTestList',
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
        type: 'itemBankManage/getSchoolCustomTestList',
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
    const that = this;
    let title = '', itemId = '';
    if (type === 'edit') {
      console.log(item);
      title = '编辑', itemId = item.id;
      this.props.dispatch({
        type: 'itemBankManage/getSchoolCustomTestItem',
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
      itemId: '',
      resourceData: [{
        key: 0,
        type: 1,
        resourceId: null,
        questionBankId: null
      }],
    });
  };
  add = () => {
    let items = this.state.resourceData
    const {dispatch, form, itemBankManage: {questionBankId}} = this.props;
    const {addModalItem, addModalType, pagination, formValues} = this.state;
    let title = '', that = this;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let values = {};
      // if (fieldsValue.type != 1) {
      //   items[0].questionBankId = questionBankId
      //   items[0].type = fieldsValue.type
      // }
      if (fieldsValue.type == 3) {
        if (fieldsValue.schoolQuestionBankId.length <= 0) {
          notification.error({
            message: '请选择题目',
          });
          return
        } else {
          for (let i = 0; i < fieldsValue.schoolQuestionBankId.length; i++) {
            items.push({
              questionBankId: fieldsValue.schoolQuestionBankId[i].value,
              type: 3
            })
          }
        }

      }

      if (addModalType === 'edit') {
        values = {
          ...fieldsValue,
          id: addModalItem.id,
          items: items,
        };
        delete values.titleS;
        delete values.levelS;
        dispatch({
          type: 'itemBankManage/uptSchoolCustomTestData',
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
          items: items,
        };
        delete values.titleS;
        delete values.levelS;
        dispatch({
          type: 'itemBankManage/addSchoolCustomTestData',
          payload: {
            values: {...values},
            searchVal: {
              ...pagination,
              page: 1,
            },
          },
          callback: () => {
            that.props.form.resetFields();
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
          type: 'itemBankManage/delSchoolCustomTestData',
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
              type: 'itemBankManage/delSchoolCustomTestData',
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
      type: 'itemBankManage/uptSchoolCustomTestData',
      payload: {
        values: {
          ...item,
          multiMediaState: item.multiMediaState == 2 ? 1 : 2,
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
  downloadQrcode = (item) => {
    window.open(`${url.baseURL}/schoolCustomTest/qrcode/${item.id}`);
  }
  selectKnow = (val) => {
    if (val != 3) {
      this.props.dispatch({
        type: 'itemBankManage/getSchoolCustomGenerateData',
        payload: {
          type: val
        }
      })
    }

  }

  changeUploadList = (type, key) => {
    let resourceData = this.state.resourceData && this.state.resourceData.length > 0 ? this.state.resourceData.slice(0) : []
    if (type === 'plus') {
      let temp = 0, sort = 0;
      for (let i = 0; i < resourceData.length; i++) {
        if (i === 0) {
          temp = resourceData[i].key
          sort = resourceData[i].sort
        } else {
          if (resourceData[i].sort > resourceData[i - 1].sort) {
            sort = resourceData[i].sort
          } else {
            sort = resourceData[i - 1].sort
          }
          if (resourceData[i].key > resourceData[i - 1].key) {
            temp = resourceData[i].key
          } else {
            temp = resourceData[i - 1].key
          }
        }

      }
      resourceData.push({
        key: temp + 1,
        type: 1,
        resourceId: null,
        questionBankId: null
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
  onSingleChange = (val, key) => {
    let resourceData = this.state.resourceData && this.state.resourceData.length > 0 ? this.state.resourceData.slice(0) : []
    for (let i = 0; i < resourceData.length; i++) {
      if (key === resourceData[i].key) {
        resourceData[i].questionBankId = val
        break;
      }
    }
    this.setState({
      resourceData: resourceData
    })
  };
  onUploadChange = (val, key) => {
    let resourceData = this.state.resourceData && this.state.resourceData.length > 0 ? this.state.resourceData.slice(0) : []
    for (let i = 0; i < resourceData.length; i++) {
      if (key === resourceData[i].key) {
        resourceData[i].type = val
        break;
      }
    }
    this.setState({
      resourceData: resourceData
    })
  };

  renderForm() {
    let statusObj = [
      <Option key={1} value={1}>简单</Option>,
      <Option key={2} value={2}>普通</Option>,
      <Option key={3} value={3}>困难</Option>,
    ];
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Inputval dispatch={this.props} dataInx={'titleS'} con={'组题标题'} innerCon={'请输入组题标题'} maxLength={'15'}
                  size={{lg: 12, xl: 8, xxl: 6}}/>
        <DropDown dispatch={this.props} size={{lg: 12, xl: 8, xxl: 6}} dataInx={'levelS'} con={'难易度'} innerCon={'全部'}
                  optObj={statusObj}/>
        <BtnSearch dispatch={this.props} con={'搜索'} size={{lg: 12, xl: 8, xxl: 1}}/>
        <Col id={'mediaXl'}>
          <Button type="primary" style={{marginLeft: '10px'}} onClick={() => this.addShow()}><Icon
            type="plus-circle"/>新增</Button>
        </Col>
      </Form>

    );
  }

  render() {
    const {itemBankManage: {loading: ruleLoading, schoolCustomTestData, schoolCustomTestItem, schoolQuestionBankDataAll, schoolCustomTestQuestions, schoolQuestionTopicDataAll}, form: {getFieldDecorator}} = this.props;
    const {addVisible, addModalTitle, addModalType, itemId, itemDetails, resourceData,} = this.state;
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
        activeIndex={2}
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

            <CustomManageTable
              loading={ruleLoading}
              data={schoolCustomTestData}
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
        {/*新增编辑*/}
        {addVisible ? <AddCustom
          dispatch={this.props}
          addVisible={addVisible}
          addShow={this.addShow}
          addHide={this.addHide}
          add={this.add}
          itemId={itemId}
          addModalTitle={addModalTitle}
          itemDetails={schoolCustomTestItem}
          items={resourceData}
          selectKnow={this.selectKnow}
          schoolQuestionBankDataAll={schoolQuestionBankDataAll}
          changeUploadList={this.changeUploadList}
          onUploadChange={this.onUploadChange}
          onSingleChange={this.onSingleChange}
          schoolQuestionTopicDataAll={schoolQuestionTopicDataAll}
        /> : ''}
      </PageHeaderLayout>
    );
  }
}
