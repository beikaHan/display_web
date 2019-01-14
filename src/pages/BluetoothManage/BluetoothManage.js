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
import BluetoothManageTable from '../../components/BluetoothManage/BluetoothManageTable.js';
import Inputval from "../../components/QueryConditionItem/Inputval.js";
import BtnSearch from "../../components/QueryConditionItem/BtnSearch.js";
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Manage.less';
import moment from 'moment';
import Add from '../../components/BluetoothManage/Add';

const confirm = Modal.confirm;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const {Option} = Select;
const {TextArea} = Input;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  bluetoothManage: state.bluetoothManage,
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
    itemId: null
  };

  componentDidMount() {
    const {dispatch} = this.props;
    const {pagination, formValues} = this.state;
    dispatch({
      type: 'bluetoothManage/getRecourseList',
    });
    dispatch({
      type: 'bluetoothManage/getSchoolBluetoothList',
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
      type: 'bluetoothManage/getSchoolBluetoothList',
      payload: params,
    });
  };

  handleSearch = (e) => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    const {pagination} = this.state;
    form.validateFields(["titleS", "uuidS"], (err, fieldsValue) => {
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
        type: 'bluetoothManage/getSchoolBluetoothList',
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
    let title = '', itemId = null;
    if (type === 'edit') {
      console.log(item);
      title = '编辑', itemId = item.id;
      this.props.dispatch({
        type: 'bluetoothManage/getSchoolBluetoothItem',
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
      itemId: null
    });
  };
  add = () => {
    const {dispatch, form} = this.props;
    const {addModalItem, addModalType, pagination, formValues} = this.state;
    let title = '', that = this;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let values = {};
      if (addModalType === 'edit') {
        values = {
          ...fieldsValue,
          id: addModalItem.id,
        };
        delete values.uuidS;
        delete values.majorS;
        delete values.minorS;
        delete values.titleS;
        dispatch({
          type: 'bluetoothManage/uptSchoolBluetoothData',
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
        };
        delete values.uuidS;
        delete values.majorS;
        delete values.minorS;
        delete values.titleS;
        dispatch({
          type: 'bluetoothManage/addSchoolBluetoothData',
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
          type: 'bluetoothManage/delSchoolBluetoothData',
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
              type: 'bluetoothManage/delSchoolBluetoothData',
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
  typeChange = (val, key) => {
    this.props.form.resetFields([{relationId: ''}]);
    this.props.dispatch({
      type: 'bluetoothManage/getRecourseList',
      payload: {
        type: val
      }
    });
  };
  // recourseChange = (val, key) => {
  //   let resourceData = this.state.resourceData && this.state.resourceData.length>0 ? this.state.resourceData.slice(0) : []
  //   for(let i=0; i<resourceData.length; i++){
  //     if(key === resourceData[i].key){
  //       resourceData[i].type = val
  //       break;
  //     }
  //   }
  //   this.setState({
  //     resourceData: resourceData
  //   })
  // };
  renderForm() {
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Inputval dispatch={this.props} dataInx={'uuidS'} con={'uuid'} innerCon={'请输入uuid'} maxLength={'15'}
                  size={{lg: 12, xl: 8, xxl: 6}}/>
        <Inputval dispatch={this.props} dataInx={'majorS'} con={'主id'} innerCon={'请输入主id'} maxLength={'15'}
                  size={{lg: 12, xl: 8, xxl: 6}}/>
        <Inputval dispatch={this.props} dataInx={'minorS'} con={'次id'} innerCon={'请输入次id'} maxLength={'15'}
                  size={{lg: 12, xl: 8, xxl: 6}}/>
        <Inputval dispatch={this.props} dataInx={'titleS'} con={'标题'} innerCon={'请输入标题'} maxLength={'15'}
                  size={{lg: 12, xl: 8, xxl: 6}}/>
        <BtnSearch dispatch={this.props} con={'搜索'} size={{lg: 1, xl: 1, xxl: 1}}/>
        <Col id={'mediaXl'}>
          <Button type="primary" style={{marginLeft: '10px'}} onClick={() => this.addShow()}><Icon
            type="plus-circle"/>新增</Button>
        </Col>
      </Form>

    );
  }

  render() {
    const {bluetoothManage: {loading: ruleLoading, schoolBluetoothData, schoolBluetoothItem, recourseList}, form: {getFieldDecorator}} = this.props;
    const {addVisible, addModalTitle, addModalType, itemId, itemDetails, detailFlag,} = this.state;
    const formItemLayout = {
      labelcol: {span: 6},
      wrappercol: {
        xs: {span: 28, offset: 0},
        sm: {span: 10, offset: 0},
      },
    };
    const menu = (
      <Menu onClick={this.handleShowBatchModal} selectedKeys={[]}>
        <Menu.Item key="del">批量删除</Menu.Item>
      </Menu>
    );
    return (
      <PageHeaderLayout title="蓝牙管理">
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

            <BluetoothManageTable
              loading={ruleLoading}
              data={schoolBluetoothData}
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
          add={this.add}
          itemId={itemId}
          itemDetails={schoolBluetoothItem}
          recourseList={recourseList}
          typeChange={this.typeChange}
        /> : ''}
      </PageHeaderLayout>
    );
  }
}
