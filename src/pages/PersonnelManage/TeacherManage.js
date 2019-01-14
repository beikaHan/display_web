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
import TeacherManageTable from '../../components/PersonnelManage/TeacherManageTable.js';
import TeacherExhibitorsTable from '../../components/PersonnelManage/TeacherExhibitorsTable.js';
import Inputval from '../../components/QueryConditionItem/Inputval.js';
import BtnSearch from '../../components/QueryConditionItem/BtnSearch.js';
import Date from '../../components/QueryConditionItem/Date.js';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Manage.less';
import moment from 'moment';
import ManageTable from '../../components/Manage/ManageTable';
import {getCookie} from '../../utils';
import url from '../../utils/ipconfig';

const FormItem = Form.Item;
const confirm = Modal.confirm;

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
  classManage: state.classManage,
}))
@Form.create()
export default class TeacherManage extends Component {
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
    exhibitorsVisible: false,
    formValuesExhibitors: {},
    paginationExhibitors: {
      rows: 10,
      page: 1,
    },
    importVisible: false,
    uploading: false,
    reportFiles: [],
    detailTitle: ''
  };

  componentDidMount() {
    const {dispatch} = this.props;
    const {pagination, formValues} = this.state;

    dispatch({
      type: 'classManage/getTeacherList',
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
      type: 'classManage/getTeacherList',
      payload: params,
    });
  };

  handleSearch = (e) => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    const {pagination} = this.state;
    console.log(pagination)
    form.validateFields(["nameS", "staffNoS"], (err, fieldsValue) => {
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
        type: 'classManage/getTeacherList',
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
        type: 'classManage/getTeacherItem',
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
    const {addModalItem, addModalType, pagination, formValues} = this.state;
    let title = '', that = this;
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
        delete values.staffNoS;
        dispatch({
          type: 'classManage/uptTeacherData',
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
        delete values.nameS;
        delete values.staffNoS;
        dispatch({
          type: 'classManage/addTeacherData',
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
          type: 'classManage/delTeacherData',
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
              type: 'classManage/delTeacherData',
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

  //模板下载
  downModal = () => {
    // location.href = '/import_temp/菜品导入模板.xlsx';
  };

  //导入
  showMenuImportModal = () => {
    this.setState({
      importVisible: true,
      fileList: [],
    });
  };

  handleTabChange = (key) => {
    const {dispatch} = this.props;
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

  handleExhibitors = (item) => {
    // TODO:参展详情日期搜索
    // e.preventDefault();
    debugger
    const {dispatch, form} = this.props;
    const {paginationExhibitors} = this.state;
    const that = this;
    const values = {
      ...paginationExhibitors,
      startDate: moment().subtract(1, 'days'),
      endDate: moment().subtract(1, 'days'),
      page: 1,
      userId: item.id,
      type: 2,
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
      callback: () => {
        that.setState({
          detailTitle: item.name,
          exhibitorsVisible: true,
        });
      }
    });


  };
  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({loading: true});
      return;
    }
    if (info.file.status === 'done') {
      console.log(info.file.response)
      this.setState({
        previewImageResourceId: info.file.response.resource.id
      });
      // // Get this url from response in real world.
      // getBase64(info.file.originFileObj, imageUrl => this.setState({
      //   imageUrl,
      //   loading: false,
      //   previewImageResourceId: info.file.response.resource.id
      // }));
    }
  }

  exhibitorsHide = () => {
    this.setState({
      detailTitle: '',
      exhibitorsVisible: false,
    });
  };

  handleExhibitorsTableChange = (pagination) => {
    const {dispatch} = this.props;
    const {formValuesExhibitors} = this.state;

    const params = {
      page: pagination.current,
      rows: pagination.pageSize,
      ...formValuesExhibitors,
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

  handleExhibitorsSearch = (e) => {
    // debugger
    e.preventDefault();
    const {dispatch, form} = this.props;
    const {paginationExhibitors, formValuesExhibitors} = this.state;
    form.validateFields(["beginDate", "endDate"], (err, fieldsValue) => {
      // if (err) return;
      const values = {
        ...formValuesExhibitors,
        ...paginationExhibitors,
        page: 1,
        startDate: moment(fieldsValue.beginDate).format('YYYY-MM-DD'),
        endDate: moment(fieldsValue.endDate).format('YYYY-MM-DD'),
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

  //菜品批量导入
  showMenuImportModal = () => {
    this.setState({
      importVisible: true,
      fileList: [],
    });
  };

  handleReportChange = (info, fileType) => {
    if (info.file.status === 'uploading') {
      this.setState({loading: true});
      return;
    }
    if (info.file.status === 'done') {
      notification.success({
        message: `${file.name} file uploaded successfully`
      });
    }
  };


  handleCancelImport = () => {
    this.setState({
      importVisible: false,
    });
  };

  renderForm() {
    const reportUploadProps = {
      name: 'file',
      headers: {
        // 'Content-Type': 'multipart/form-data',
        'JSESSIONID': getCookie() ? getCookie() : null
      },
      action: `${url.baseURL}/schoolTeacher/import`,
      fileList: [],
      onChange: (info) => this.handleReportChange(info),
    };
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Inputval dispatch={this.props} dataInx={'staffNoS'} con={'员工号'} innerCon={'请输入员工号'} maxLength={'15'}
                  size={{lg: 12, xl: 8, xxl: 6}}/>
        <Inputval dispatch={this.props} dataInx={'nameS'} con={'名称'} innerCon={'请输入名称'} maxLength={'15'}
                  size={{lg: 12, xl: 7, xxl: 6}}/>

        <BtnSearch dispatch={this.props} con={'搜索'} size={{lg: 1, xl: 1, xxl: 1}}/>
        <Col id={'mediaXl'}>
          <Button type="primary" style={{marginLeft: '10px'}} onClick={this.downModal}><Icon
            type="download"/>模板下载</Button>
          <span style={{display: 'inline-block'}}><Upload {...reportUploadProps}><Button type="primary"
                                                                                         style={{marginLeft: '10px'}}><Icon
            type="select"/>导入</Button></Upload></span>
          <Button type="primary" style={{marginLeft: '10px'}} onClick={() => this.addShow()}><Icon
            type="plus-circle"/>新增</Button>

        </Col>
      </Form>

    );
  }

  render() {
    const {classManage: {loading: ruleLoading, teacherData, teacherItem, teacherDetailData}, form: {getFieldDecorator}} = this.props;
    const {addVisible, addModalTitle, addModalType, exhibitorsVisible, importVisible, reportFiles, uploading, detailTitle} = this.state;
    const formItemLayout = {
      labelcol: {span: 6},
      wrappercol: {
        xs: {span: 28, offset: 0},
        sm: {span: 10, offset: 0},
      },
    };

    let tabList = [
      {key: 'teacherManage', tab: '教师管理'},
      {key: 'studentManage', tab: '学生管理'},
      {key: 'classManage', tab: '班级管理'},
    ];
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="del">批量删除</Menu.Item>
      </Menu>
    );
    const reportUploadProps = {
      name: 'file',
      headers: {
        // 'Content-Type': 'multipart/form-data',
        'JSESSIONID': getCookie() ? getCookie() : null
      },
      action: `${url.baseURL}/resource/upload`,
      onChange: (info) => this.handleReportChange(info),
      onRemove: (info) => this.handleReportRemove(info),
      fileList: reportFiles,
    };
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

            <TeacherManageTable
              loading={ruleLoading}
              data={teacherData}
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

        <Modal title={addModalTitle}
               visible={addVisible}
               onOk={this.add}
               onCancel={() => this.addHide()}
               className={styles.addModal}
        >
          <Form layout="inline">
            <FormItem label="员工号" {...formItemLayout}>
              {getFieldDecorator('staffNo', {
                  initialValue: addModalType === 'edit' && teacherItem ? teacherItem.staffNo : '',
                  rules: [{
                    required: true,
                    message: '请输入员工号',
                  }],
                },
              )(
                <Input placeholder={'请输入员工号'} maxLength={100}/>,
              )}
            </FormItem>
            <FormItem label="姓名" {...formItemLayout}>
              {getFieldDecorator('name', {
                  initialValue: addModalType === 'edit' && teacherItem ? teacherItem.name : '',
                  rules: [{
                    required: true,
                    message: '请输入姓名',
                  }],
                },
              )(
                <Input placeholder={'请输入姓名'} maxLength={100}/>,
              )}
            </FormItem>
            <FormItem label="密码" {...formItemLayout}>
              {getFieldDecorator('password', {
                  initialValue: addModalType === 'edit' && teacherItem ? teacherItem.password : '',
                  rules: [{
                    required: true,
                    message: '请输入密码',
                  }],
                },
              )(
                <Input placeholder={'请输入密码'} type='password' maxLength={100}/>,
              )}
            </FormItem>
          </Form>
        </Modal>

        <Modal title={detailTitle + ': 参展详情'}
               visible={exhibitorsVisible}
               onOk={this.exhibitorsHide}
               onCancel={() => this.exhibitorsHide()}
               className={styles.detailModal}
               footer={[
                 <Button key="submit" type="primary" onClick={this.exhibitorsHide}
                         style={{margin: 'auto', padding: '0 50px'}}>确认</Button>,
               ]}
        >
          <div className={styles.classManageListForm}>
            <Form onSubmit={this.handleExhibitorsSearch} layout="inline">
              <Date dispatch={this.props} con={'日期期间'} size={{lg: 20, xl: 20, xxl: 20}}/>
              <BtnSearch dispatch={this.props} con={'搜索'} size={{lg: 1, xl: 1, xxl: 1}}/>

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

        <Modal
          key={'importModal'}
          visible={importVisible}
          title="教师批量导入"
          onOk={this.handleUpload}
          onCancel={this.handleCancelImport}
          destroyOnClose={true}
          footer={[
            <Button key="submit"
                    type="primary"
                    className="upload-demo-start"
                    onClick={this.handleChange}
                    loading={uploading}
                    style={{padding: '0 50px'}}>
              {uploading ? '上传中' : '确认'}
            </Button>,
            <Button key="back" onClick={this.handleCancelImport} style={{padding: '0 50px'}}>取消</Button>,
          ]}
        >
          <div>
            <div>
              <span style={{display: 'inline-block'}}>
                <Upload {...reportUploadProps}>
                  <Button>
                    <Icon type="upload"/> Upload
                  </Button>
                </Upload>
              </span>
              {reportFiles.length === 0 ? <span style={{marginLeft: '20px'}}>未选择任何文件</span> : ''}
            </div>
          </div>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
