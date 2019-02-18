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
import CustomManageTable from '../../components/ItemBankManage/CustomManageTable.js';
import Inputval from '../../components/QueryConditionItem/Inputval.js';
import BtnSearch from '../../components/QueryConditionItem/BtnSearch.js';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Manage.less';
import moment from 'moment';
import DropDown from '../../components/QueryConditionItem/DropDown';
import AddCustom from '../../components/ItemBankManage/AddCustom';
import url from '../../utils/ipconfig';
import Date from '../../components/QueryConditionItem/Date';
import AddCustomTable from '../../components/ItemBankManage/AddCustomTable';
import ItemManageTable from '../../components/ItemBankManage/ItemManageTable';

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
    itemId: '',
    selectQuestionVisible: false,
    formValuesAddCustom: {},
    paginationAddCustom: {
      rows: 10,
      page: 1,
    },
    selectedAddCustomRows: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { pagination, formValues } = this.state;
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
      type: 'itemBankManage/getSchoolCustomTestList',
      payload: params,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { pagination } = this.state;
    form.validateFields(['titleS', 'cusLevelS'], (err, fieldsValue) => {
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

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  addShow = (type, item) => {
    const that = this;
    let title = '',
      itemId = '';
    if (type === 'edit') {
      console.log(item);
      (title = '编辑'), (itemId = item.id);
      this.props.dispatch({
        type: 'itemBankManage/getSchoolCustomTestItem',
        payload: {
          id: item.id,
        },
        callback: items => {
          console.log(items);
          let ss = items.map(row => row.id);
          console.log(ss);
          if (items && items.length > 0) {
            that.setState({
              resourceData: items,
              selectedAddCustomRows: items,
              selectedRowKeys: items.map(row => row.id),
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
      itemId: '',
      resourceData: [
        {
          key: 0,
          type: 1,
          resourceId: null,
          questionBankId: null,
        },
      ],
      selectedAddCustomRows: [],
      selectedRowKeys: [],
    });
  };
  add = () => {
    // let items = this.state.resourceData
    let items = [];
    const {
      dispatch,
      form,
      itemBankManage: { questionBankId },
    } = this.props;
    const {
      addModalItem,
      addModalType,
      pagination,
      formValues,
      selectedAddCustomRows,
    } = this.state;
    let title = '',
      that = this;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let values = {};

      if (fieldsValue.type == 3) {
        if (selectedAddCustomRows.length <= 0) {
          notification.error({
            message: '请选择题目',
          });
          return;
        } else {
          for (let i = 0; i < selectedAddCustomRows.length; i++) {
            items.push({
              questionBankId: selectedAddCustomRows[i].id,
              type: 3,
            });
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
        delete values.cusLevelS;
        delete values.levelS;
        delete values.contentS;
        delete values.questionTypeS;
        dispatch({
          type: 'itemBankManage/uptSchoolCustomTestData',
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
          items: items,
        };
        delete values.titleS;
        delete values.cusLevelS;
        delete values.levelS;
        delete values.contentS;
        delete values.questionTypeS;
        dispatch({
          type: 'itemBankManage/addSchoolCustomTestData',
          payload: {
            values: { ...values },
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
      case 'qrcode':
        confirm({
          title: '',
          content: '是否确认批量下载二维码？',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            window.open(
              `${url.baseURL}/schoolCustomTest/qrcode/batch?ids=${selectedRows.map(row => row.id)}`
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
  };
  handleTabChange = key => {
    const { dispatch } = this.props;
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
  downloadQrcode = item => {
    window.open(`${url.baseURL}/schoolCustomTest/qrcode/${item.id}`);
  };
  selectKnow = val => {
    if (val != 3) {
      this.props.dispatch({
        type: 'itemBankManage/getSchoolCustomGenerateData',
        payload: {
          type: val,
        },
      });
    }
  };

  changeUploadList = (type, key) => {
    let resourceData =
      this.state.resourceData && this.state.resourceData.length > 0
        ? this.state.resourceData.slice(0)
        : [];
    if (type === 'plus') {
      let temp = 0,
        sort = 0;
      for (let i = 0; i < resourceData.length; i++) {
        if (i === 0) {
          temp = resourceData[i].key;
          sort = resourceData[i].sort;
        } else {
          if (resourceData[i].sort > resourceData[i - 1].sort) {
            sort = resourceData[i].sort;
          } else {
            sort = resourceData[i - 1].sort;
          }
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
        questionBankId: null,
      });
    } else {
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
  onSingleChange = (val, key) => {
    let resourceData =
      this.state.resourceData && this.state.resourceData.length > 0
        ? this.state.resourceData.slice(0)
        : [];
    for (let i = 0; i < resourceData.length; i++) {
      if (key === resourceData[i].key) {
        resourceData[i].questionBankId = val;
        break;
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

  selectQuestions = flag => {
    if (flag) {
      const { dispatch, form } = this.props;
      const { paginationAddCustom } = this.state;
      const that = this;
      const values = {
        ...paginationAddCustom,
        page: 1,
      };
      this.setState({
        formValuesAddCustom: values,
        paginationAddCustom: {
          ...paginationAddCustom,
          page: 1,
        },
      });

      dispatch({
        type: 'itemBankManage/getSchoolQuestionBankList',
        payload: values,
        callback: () => {
          that.setState({
            selectQuestionVisible: true,
          });
        },
      });
    } else {
      this.setState({
        selectQuestionVisible: false,
      });
    }
  };
  handleAddCustomTableChange = pagination => {
    const { dispatch } = this.props;
    const { formValuesAddCustom } = this.state;

    const params = {
      ...formValuesAddCustom,
      page: pagination.current,
      rows: pagination.pageSize,
    };
    this.setState({
      paginationAddCustom: {
        rows: pagination.pageSize,
        page: pagination.current,
      },
    });
    dispatch({
      type: 'itemBankManage/getSchoolQuestionBankList',
      payload: params,
    });
  };
  handleAddCustomSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const { paginationAddCustom, formValuesAddCustom } = this.state;
    form.validateFields(['contentS', 'levelS', 'questionTypeS'], (err, fieldsValue) => {
      // if (err) return;
      const values = {
        ...fieldsValue,
        ...paginationAddCustom,
        page: 1,
      };
      this.setState({
        formValuesExhibitors: values,
        paginationExhibitors: {
          ...paginationAddCustom,
          page: 1,
        },
      });

      dispatch({
        type: 'itemBankManage/getSchoolQuestionBankList',
        payload: values,
      });
    });
  };

  handleAddCustomRows = rows => {
    this.setState({
      selectedAddCustomRows: rows,
      selectedRowKeys: rows.map(row => row.id),
    });
  };
  selectQuestionsHide = () => {
    const { resourceData } = this.state;
    this.setState({
      selectQuestionVisible: false,
      selectedAddCustomRows: resourceData,
      selectedRowKeys: resourceData.map(row => row.id),
    });
  };
  renderForm() {
    let statusObj = [
      <Option key={1} value={1}>
        简单
      </Option>,
      <Option key={2} value={2}>
        普通
      </Option>,
      <Option key={3} value={3}>
        困难
      </Option>,
    ];
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Inputval
          dispatch={this.props}
          dataInx={'titleS'}
          con={'组题标题'}
          innerCon={'请输入组题标题'}
          maxLength={'15'}
          size={{ lg: 12, xl: 8, xxl: 6 }}
        />
        <DropDown
          dispatch={this.props}
          size={{ lg: 12, xl: 8, xxl: 6 }}
          dataInx={'cusLevelS'}
          con={'难易度'}
          innerCon={'全部'}
          optObj={statusObj}
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
      itemBankManage: {
        loading: ruleLoading,
        schoolCustomTestData,
        schoolCustomTestItem,
        schoolQuestionBankDataAll,
        schoolQuestionBankData,
        schoolQuestionTopicDataAll,
      },
      form: { getFieldDecorator },
    } = this.props;
    const {
      addVisible,
      addModalTitle,
      selectQuestionVisible,
      itemId,
      selectedRowKeys,
      resourceData,
    } = this.state;
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
    let statusObj = [
      <Option key={'1'} value={'1'}>
        简单
      </Option>,
      <Option key={'2'} value={'2'}>
        普通
      </Option>,
      <Option key={'3'} value={'3'}>
        困难
      </Option>,
    ];
    let questionTypeObj = [
      <Option key={'1'} value={'1'}>
        单选
      </Option>,
      <Option key={'2'} value={'2'}>
        多选
      </Option>,
      // <Option key={'3'} value={'3'}>选择</Option>,
      <Option key={'4'} value={'4'}>
        判断
      </Option>,
    ];
    let tabList = [
      { key: 'knowPointsManage', tab: '知识点管理' },
      { key: 'itemManage', tab: '题库管理' },
      { key: 'customManage', tab: '自定义组题' },
      { key: 'groupManage', tab: '组题规则' },
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

        <Modal
          title="选择题目"
          visible={selectQuestionVisible}
          onOk={() => this.selectQuestions(false)}
          onCancel={() => this.selectQuestionsHide()}
          className={styles.detailModal}
          footer={[
            <Button
              key="submit"
              type="primary"
              onClick={() => this.selectQuestions(false)}
              style={{ margin: 'auto', padding: '0 50px' }}
            >
              确认
            </Button>,
            <Button
              key="cancel"
              onClick={() => this.selectQuestionsHide()}
              style={{ marginLeft: '20px', padding: '0 50px' }}
            >
              取消
            </Button>,
          ]}
        >
          <div className={styles.classManageListForm}>
            <Form onSubmit={this.handleAddCustomSearch} layout="inline">
              <Inputval
                dispatch={this.props}
                dataInx={'contentS'}
                con={'题目内容'}
                innerCon={'请输入题目内容'}
                maxLength={'15'}
                size={{ lg: 12, xl: 8, xxl: 6 }}
              />
              <DropDown
                dispatch={this.props}
                size={{ lg: 12, xl: 8, xxl: 6 }}
                dataInx={'levelS'}
                con={'难易度'}
                innerCon={'全部'}
                optObj={statusObj}
              />
              <DropDown
                dispatch={this.props}
                size={{ lg: 12, xl: 8, xxl: 6 }}
                dataInx={'questionTypeS'}
                con={'题目类型'}
                innerCon={'全部'}
                optObj={questionTypeObj}
              />
              <BtnSearch dispatch={this.props} con={'搜索'} size={{ lg: 1, xl: 1, xxl: 1 }} />
            </Form>
          </div>
          <AddCustomTable
            data={schoolQuestionBankData}
            onChange={this.handleAddCustomTableChange}
            onSelectRow={this.handleAddCustomRows}
            selectedRowKeys={selectedRowKeys}
            // dispatch={this.props.dispatch}
            // myData={this.myData}
            // certificateInfo={this.certificateInfo}
          />
        </Modal>

        {/*新增编辑*/}
        {addVisible ? (
          <AddCustom
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
            selectQuestions={this.selectQuestions}
            schoolQuestionTopicDataAll={schoolQuestionTopicDataAll}
          />
        ) : (
          ''
        )}
      </PageHeaderLayout>
    );
  }
}
