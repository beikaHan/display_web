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
import ItemManageTable from '../../components/ItemBankManage/ItemManageTable.js';
import Inputval from "../../components/QueryConditionItem/Inputval.js";
import BtnSearch from "../../components/QueryConditionItem/BtnSearch.js";
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Manage.less';
import moment from 'moment';
import DropDown from '../../components/QueryConditionItem/DropDown';
import Add from '../../components/ItemBankManage/Add';

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
    resourceData: [{
      key: 0,
      type: 1,
      resourceId: null,
      sort: 1,
      content: null
    }],
  };

  componentDidMount() {
    const {dispatch} = this.props;
    const {pagination, formValues} = this.state;
    dispatch({
      type: 'itemBankManage/getSchoolQuestionTopicAll',
    });
    dispatch({
      type: 'itemBankManage/getSchoolQuestionBankList',
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
      type: 'itemBankManage/getSchoolQuestionBankList',
      payload: params,
    });
  };

  handleSearch = (e) => {
    e.preventDefault();
    const {dispatch, form} = this.props;
    const {pagination} = this.state;
    form.validateFields(["contentS", "levelS", "questionTypeS"], (err, fieldsValue) => {
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
        type: 'itemBankManage/getSchoolQuestionBankList',
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
    let title = '', itemId = '';
    const that = this
    this.props.dispatch({
      type: 'itemBankManage/getSchoolCustomTestConfigoItem',
      callback: (schoolCustomTestConfig) => {
        if (schoolCustomTestConfig && schoolCustomTestConfig.id) {
          if (type === 'edit') {
            console.log(item);
            title = '编辑', itemId = item.id;
            that.props.dispatch({
              type: 'itemBankManage/getSchoolQuestionBankItem',
              payload: {
                id: item.id,
              },
              callback: (items) => {
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
        } else {
          notification.error({
            message: '暂无组题规则，请先设置组题规则',
          });
          return;
        }
      }
    })


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
        sort: 1,
        content: null
      }]
    });
  };
  add = (materialResourceId) => {
    let items = this.state.resourceData
    const {dispatch, form} = this.props;
    const {addModalItem, addModalType, pagination, formValues,} = this.state;
    let title = '', that = this, isCorrectTemp = [];

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let values = {};
      if (fieldsValue.questionType != 4) {
        if (items.length < 2) {
          notification.error({
            message: '请添加两个以上答案',
          });
          return
        } else if (items.length > 9) {
          notification.error({
            message: '请添加九个以下答案',
          });
          return
        }
      }
      for (let i = 0; i < items.length; i++) {
        items[i].isCorrect = null
        if (fieldsValue.questionType !== 4) {

          if (items[i].content == undefined || items[i].content == '') {
            notification.error({
              message: '请输入完整答案',
            });
            return
          }
        }

      }
      if (fieldsValue.questionType === 1) {
        for (let i = 0; i < items.length; i++) {
          if (fieldsValue.item == undefined) {
            notification.error({
              message: '请选择正确答案',
            });
            return
          }
          if (items[i].sort === fieldsValue.item) {
            items[i].isCorrect = 1
          }

        }
      }

      if (fieldsValue.questionType === 2) {
        if (fieldsValue.itemMore.length <= 0) {
          notification.error({
            message: '请选择正确答案',
          });
          return
        }
        for (let i = 0; i < items.length; i++) {
          for (let j = 0; j < fieldsValue.itemMore.length; j++) {
            if (items[i].sort === fieldsValue.itemMore[j]) {
              items[i].isCorrect = 1
            }

          }

        }
      }

      if (fieldsValue.questionType === 4) {
        if(fieldsValue.itemNike == 1){
          items[0].isCorrect = 1
          items[0].content = '对'
          items[1] = {}
          items[1].isCorrect = 2
          items[1].content = '错'
        }else{
          items[0].isCorrect = 2
          items[0].content = '对'
          items[1] = {}
          items[1].isCorrect = 1
          items[1].content = '错'
        }
        
        // for (let i = 0; i < items.length; i++) {
        //   items[i].isCorrect = fieldsValue.itemNike
        // }
      }


      if (addModalType === 'edit') {
        values = {
          ...fieldsValue,
          id: addModalItem.id,
          items: items,
          materialResourceId: materialResourceId,
        };
        delete values.contentS;
        delete values.levelS;
        delete values.questionTypeS;
        delete values.previewImageUrl;
        dispatch({
          type: 'itemBankManage/uptSchoolQuestionBankData',
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
          materialResourceId: materialResourceId,
        };
        delete values.contentS;
        delete values.levelS;
        delete values.questionTypeS;
        delete values.previewImageUrl;
        dispatch({
          type: 'itemBankManage/addSchoolQuestionBankData',
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
          type: 'itemBankManage/delSchoolQuestionBankData',
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
              type: 'itemBankManage/delSchoolQuestionBankData',
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
  changeUploadList = (type, key, sort) => {
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
        sort: sort + 1,
        content: null
      })
    } else {
      if (resourceData && resourceData.length <= 1) {
        notification.error({
          message: '至少保留一条',
        });
        return
      }
      for (let i = 0; i < resourceData.length; i++) {
        if (key === resourceData[i].key) {
          resourceData.splice(i, 1)
          if (i < resourceData.length - 1) {
            resourceData[i + 1].sort = sort
          }

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
        resourceData[i].content = val
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
  handleresourceChange = (info, key) => {
    let resourceData = this.state.resourceData && this.state.resourceData.length > 0 ? this.state.resourceData.slice(0) : []

    if (info.file.status === 'uploading') {
      this.setState({loading: true});
      return;
    }
    if (info.file.status === 'done') {
      console.log(info.file.response)
      for (let i = 0; i < resourceData.length; i++) {
        if (key === resourceData[i].key) {
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
    let statusObj = [
      <Option key={'1'} value={'1'}>简单</Option>,
      <Option key={'2'} value={'2'}>普通</Option>,
      <Option key={'3'} value={'3'}>困难</Option>,
    ];
    let questionTypeObj = [
      <Option key={'1'} value={'1'}>单选</Option>,
      <Option key={'2'} value={'2'}>多选</Option>,
      // <Option key={'3'} value={'3'}>选择</Option>,
      <Option key={'4'} value={'4'}>判断</Option>,
    ];
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Inputval dispatch={this.props} dataInx={'contentS'} con={'题目内容'} innerCon={'请输入题目内容'} maxLength={'15'}
                  size={{lg: 12, xl: 8, xxl: 6}}/>
        <DropDown dispatch={this.props} size={{lg: 12, xl: 8, xxl: 6}} dataInx={'levelS'} con={'难易度'} innerCon={'全部'}
                  optObj={statusObj}/>
        <DropDown dispatch={this.props} size={{lg: 12, xl: 8, xxl: 6}} dataInx={'questionTypeS'} con={'题目类型'}
                  innerCon={'全部'}
                  optObj={questionTypeObj}/>

        <BtnSearch dispatch={this.props} con={'搜索'} size={{lg: 12, xl: 8, xxl: 1}}/>
        <Col id={'mediaXl'}>
          <Button type="primary" style={{marginLeft: '10px'}} onClick={() => this.addShow()}><Icon
            type="plus-circle"/>新增</Button>
        </Col>
      </Form>

    );
  }

  render() {
    const {itemBankManage: {schoolQuestionTopicDataAll, loading: ruleLoading, schoolQuestionBankData, schoolQuestionBankItem}, form: {getFieldDecorator}} = this.props;
    const {addVisible, addModalTitle, addModalType, itemId, itemDetails, detailFlag, resourceData} = this.state;
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

            <ItemManageTable
              loading={ruleLoading}
              data={schoolQuestionBankData}
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
          itemDetails={schoolQuestionBankItem}
          items={resourceData}
          addModalTitle={addModalTitle}
          schoolQuestionTopicData={schoolQuestionTopicDataAll}
          changeUploadList={this.changeUploadList}
          onUploadChange={this.onUploadChange}
          handleresourceChange={this.handleresourceChange}
          onSingleChange={this.onSingleChange}
        /> : ''}
      </PageHeaderLayout>
    );
  }
}
