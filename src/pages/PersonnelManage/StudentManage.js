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
import StudentManageTable from '../../components/PersonnelManage/StudentManageTable.js';
import Inputval from '../../components/QueryConditionItem/Inputval.js';
import BtnSearch from '../../components/QueryConditionItem/BtnSearch.js';
import DropDown from '../../components/QueryConditionItem/DropDown.js';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import TeacherExhibitorsTable from '../../components/PersonnelManage/TeacherExhibitorsTable.js';

import Date from '../../components/QueryConditionItem/Date.js';
import styles from './Manage.less';
import moment from 'moment';
import { getCookie } from '../../utils';
import url from '../../utils/ipconfig';

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
  classManage: state.classManage,
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
    detailTitle: '',
    exhibitorsVisible: false,
    formValuesExhibitors: {},
    paginationExhibitors: {
      rows: 10,
      page: 1,
    },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { pagination, formValues } = this.state;
    dispatch({
      type: 'classManage/getClassAll',
    });
    dispatch({
      type: 'classManage/getStudentList',
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
      type: 'classManage/getStudentList',
      payload: params,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { pagination } = this.state;
    form.validateFields(['nameS', 'studentNoS', 'classTitleS', 'statusS'], (err, fieldsValue) => {
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
        type: 'classManage/getStudentList',
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
        type: 'classManage/getStudentItem',
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
    const { dispatch, form } = this.props;
    const { addModalItem, addModalType, pagination, formValues } = this.state;
    let title = '',
      that = this;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let values = {};
      if (addModalType === 'edit') {
        values = {
          ...fieldsValue,
          id: addModalItem.id,
          adminUserId: addModalItem.adminUserId,
        };
        delete values.nameS;
        delete values.studentNoS;
        delete values.classTitleS;
        delete values.statusS;
        dispatch({
          type: 'classManage/uptStudentData',
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
        values = {
          ...fieldsValue,
        };
        delete values.nameS;
        delete values.studentNoS;
        delete values.classTitleS;
        delete values.statusS;
        dispatch({
          type: 'classManage/addStudentData',
          payload: {
            values: { ...values },
            searchVal: {
              ...pagination,
              page: 1,
            },
          },
          callback: () => {
            // that.props.form.resetFields();
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
          type: 'classManage/delStudentData',
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
              type: 'classManage/delStudentData',
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

  handleInfo = item => {
    const that = this;
    const { dispatch } = this.props;
    const { formValues, pagination } = this.state;
    dispatch({
      type: 'classManage/uptStudentData',
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
  };
  handleTabChange = key => {
    const { dispatch } = this.props;
    console.log(key);
    switch (key) {
      case 'teacherManage':
        dispatch(routerRedux.push('/personnelManage/teacher-manage'));
        break;
      case 'studentManage':
        dispatch(routerRedux.push('/personnelManage/student-manage'));
        break;
      case 'classManage':
        dispatch(routerRedux.push('/personnelManage/class-manage'));
        break;
      default:
        break;
    }
  };
  handleExhibitors = item => {
    // TODO:参展详情
    const { formValuesExhibitors, paginationExhibitors } = this.state;
    this.props.dispatch({
      type: 'classManage/getTeacherDetail',
      payload: {
        ...formValuesExhibitors,
        ...paginationExhibitors,
        userId: item.id,
        type: 1,
      },
    });
    this.setState({
      detailTitle: item.name,
      exhibitorsVisible: true,
    });
  };
  exhibitorsHide = () => {
    this.setState({
      exhibitorsVisible: false,
    });
  };
  handleExhibitorsTableChange = pagination => {
    const { dispatch } = this.props;
    const { formValuesExhibitors } = this.state;

    const params = {
      ...formValuesExhibitors,
      page: pagination.current,
      rows: pagination.pageSize,
    };
    this.setState({
      paginationExhibitors: {
        rows: pagination.pageSize,
        page: pagination.current,
      },
    });
    dispatch({
      type: 'classManage/getTeacherDetail',
      payload: params,
    });
  };

  handleExhibitorsSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { paginationExhibitors } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        ...paginationExhibitors,
        page: 1,
      };
      this.setState({
        formValuesExhibitors: values,
        paginationExhibitors: {
          ...paginationExhibitors,
          page: 1,
        },
      });

      dispatch({
        type: 'classManage/getTeacherDetail',
        payload: values,
      });
    });
  };
  certificateInfo = () => {
    this.setState({
      exhibitorsVisible: false,
    });
  };
  myData = () => {
    this.setState({
      exhibitorsVisible: false,
    });
  };
  handleReportChange = (info, fileType) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      notification.success({
        message: `${file.name} file uploaded successfully`,
      });
    }
  };

  renderForm() {
    let statusObj = [
      <Option key={1} value={1}>
        启用
      </Option>,
      <Option key={2} value={2}>
        禁用
      </Option>,
    ];
    const reportUploadProps = {
      name: 'file',
      headers: {
        // 'Content-Type': 'multipart/form-data',
        JSESSIONID: getCookie() ? getCookie() : null,
      },
      action: `${url.baseURL}/schoolStudent/import`,
      fileList: [],
      onChange: info => this.handleReportChange(info),
    };
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Inputval
          dispatch={this.props}
          dataInx={'studentNoS'}
          con={'学号'}
          innerCon={'请输入学号'}
          maxLength={'15'}
          size={{ lg: 12, xl: 8, xxl: 6 }}
        />
        <Inputval
          dispatch={this.props}
          dataInx={'nameS'}
          con={'姓名'}
          innerCon={'请输入姓名'}
          maxLength={'15'}
          size={{ lg: 12, xl: 7, xxl: 6 }}
        />
        <Inputval
          dispatch={this.props}
          dataInx={'classTitleS'}
          con={'班级'}
          innerCon={'请输入班级'}
          maxLength={'15'}
          size={{ lg: 12, xl: 7, xxl: 6 }}
        />
        <DropDown
          dispatch={this.props}
          size={{ lg: 12, xl: 8, xxl: 6 }}
          dataInx={'statusS'}
          con={'状态'}
          innerCon={'全部'}
          optObj={statusObj}
        />
        <BtnSearch dispatch={this.props} con={'搜索'} size={{ lg: 12, xl: 8, xxl: 1 }} />
        <Col id={'mediaXl'}>
          <Button type="primary" style={{ marginLeft: '10px' }} onClick={this.downModal}>
            <Icon type="download" />
            模板下载
          </Button>
          <span style={{ display: 'inline-block' }}>
            <Upload {...reportUploadProps}>
              <Button type="primary" style={{ marginLeft: '10px' }}>
                <Icon type="select" />
                导入
              </Button>
            </Upload>
          </span>
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
      classManage: {
        loading: ruleLoading,
        studentData,
        studentItem,
        classDataAll,
        teacherDetailData,
      },
      form: { getFieldDecorator },
    } = this.props;
    const { addVisible, addModalTitle, addModalType, detailTitle, exhibitorsVisible } = this.state;
    const formItemLayout = {
      labelcol: { span: 6 },
      wrappercol: {
        xs: { span: 28, offset: 0 },
        sm: { span: 10, offset: 0 },
      },
    };
    let classObj = [];
    classDataAll &&
      classDataAll.map(el => {
        classObj.push(
          <Option value={el.id} key={el.id}>
            {el.title}
          </Option>
        );
      });

    let tabList = [
      { key: 'teacherManage', tab: '教师管理' },
      { key: 'studentManage', tab: '学生管理' },
      { key: 'classManage', tab: '班级管理' },
    ];
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="del">批量删除</Menu.Item>
      </Menu>
    );
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

            <StudentManageTable
              loading={ruleLoading}
              data={studentData}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              dispatch={this.props.dispatch}
              uptInfo={this.addShow}
              delInfo={this.delInfo}
              handleInfo={this.handleInfo}
              handleExhibitors={this.handleExhibitors}
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
            <FormItem label="学号" {...formItemLayout}>
              {getFieldDecorator('studentNo', {
                initialValue: addModalType === 'edit' && studentItem ? studentItem.studentNo : '',
                rules: [
                  {
                    required: true,
                    message: '请输入学号',
                  },
                ],
              })(<Input placeholder={'请输入学号'} maxLength={100} />)}
            </FormItem>
            <FormItem label="姓名" {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: addModalType === 'edit' && studentItem ? studentItem.name : '',
                rules: [
                  {
                    required: true,
                    message: '请输入姓名',
                  },
                ],
              })(<Input placeholder={'请输入姓名'} maxLength={100} />)}
            </FormItem>
            <FormItem label="手机号" {...formItemLayout}>
              {getFieldDecorator('phone', {
                initialValue: addModalType === 'edit' && studentItem ? studentItem.phone : '',
                rules: [
                  {
                    required: true,
                    message: '请输入手机号',
                  },
                ],
              })(<Input placeholder={'请输入手机号'} maxLength={100} />)}
            </FormItem>

            <FormItem label="密码" {...formItemLayout}>
              {getFieldDecorator('password', {
                initialValue: addModalType === 'edit' && studentItem ? studentItem.password : '',
                rules: [
                  {
                    required: true,
                    message: '请输入密码',
                  },
                ],
              })(<Input placeholder={'请输入密码'} maxLength={100} />)}
            </FormItem>
            <FormItem label="性别" {...formItemLayout}>
              {getFieldDecorator('sex', {
                initialValue: addModalType === 'edit' && studentItem ? studentItem.sex : 1,
              })(
                <RadioGroup>
                  <Radio value={1}>男</Radio>
                  <Radio value={2}>女</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem label="状态" {...formItemLayout}>
              {getFieldDecorator('status', {
                initialValue: addModalType === 'edit' && studentItem ? studentItem.status : 1,
              })(
                <RadioGroup>
                  <Radio value={1}>启用</Radio>
                  <Radio value={2}>禁用</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem label="班级" {...formItemLayout}>
              {getFieldDecorator('classId', {
                initialValue: addModalType === 'edit' && studentItem ? studentItem.classId : '',
              })(<Select placeholder="请选择">{classObj}</Select>)}
            </FormItem>
          </Form>
        </Modal>
        <Modal
          title={detailTitle + ': 参展详情'}
          visible={exhibitorsVisible}
          onOk={this.exhibitorsHide}
          onCancel={() => this.exhibitorsHide()}
          className={styles.detailModal}
          footer={[
            <Button
              key="submit"
              type="primary"
              onClick={this.exhibitorsHide}
              style={{ margin: 'auto', padding: '0 50px' }}
            >
              确认
            </Button>,
          ]}
        >
          <div className={styles.classManageListForm}>
            <Form onSubmit={this.handleExhibitorsSearch} layout="inline">
              <Date dispatch={this.props} con={'日期期间'} size={{ lg: 20, xl: 20, xxl: 20 }} />
              <BtnSearch dispatch={this.props} con={'搜索'} size={{ lg: 1, xl: 1, xxl: 1 }} />
            </Form>
          </div>
          <TeacherExhibitorsTable
            loading={ruleLoading}
            data={teacherDetailData}
            onChange={this.handleExhibitorsTableChange}
            dispatch={this.props.dispatch}
            myData={this.myData}
            certificateInfo={this.certificateInfo}
          />
        </Modal>
      </PageHeaderLayout>
    );
  }
}
