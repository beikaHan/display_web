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
import QuestionnaireInvestigationTable
  from '../../components/QuestionnaireInvestigation/QuestionnaireInvestigationTable.js';
import Inputval from "../../components/QueryConditionItem/Inputval.js";
import BtnSearch from "../../components/QueryConditionItem/BtnSearch.js";
import DateAndTime from "../../components/QueryConditionItem/DateAndTime.js";
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Manage.less';
import moment from 'moment';
import Add from '../../components/QuestionnaireInvestigation/Add';

const confirm = Modal.confirm;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const {Option} = Select;
const {TextArea} = Input;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  questionnaireInvestigation: state.questionnaireInvestigation,
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
    detailVisible: false,
    detail: {},
    itemId: '',
    resourceData: [
      {
        items: [
          {
            schoolQuestionnaireItemAnswer: {content: ''},
          }
        ],
        schoolQuestionnaireItem: {content: ''},
        resourceId: null,
      }
    ]
  };

  componentDidMount() {
    const {dispatch} = this.props;
    const {pagination, formValues} = this.state;

    dispatch({
      type: 'questionnaireInvestigation/getSchoolQuestionnaireList',
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
      page: pagination.current,
      rows: pagination.pageSize,
      ...formValues,
    };
    this.setState({
      pagination: {
        rows: pagination.pageSize,
        page: pagination.current,
      },
    });
    dispatch({
      type: 'questionnaireInvestigation/getSchoolQuestionnaireList',
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
        type: 'questionnaireInvestigation/getSchoolQuestionnaireList',
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
    if (type === 'edit') {
      title = '编辑', itemId = item.id;
      this.props.dispatch({
        type: 'questionnaireInvestigation/getSchoolQuestionnaireItem',
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
      itemId: itemId,
    });
  };
  addHide = () => {
    // this.props.form.resetFields();
    this.setState({
      addVisible: false,
      addModalTitle: '',
      addModalType: '',
      addModalItem: '',
      itemId: '',
      resourceData: [{
        items: [
          {
            schoolQuestionnaireItemAnswer: {content: ''},
          }
        ],
        schoolQuestionnaireItem: {content: ''},
        resourceId: null,
      }]
    });
  };
  decorateItems = () => {

  };
  add = () => {
    let items = this.state.resourceData
    const {dispatch, form} = this.props;
    const {addModalItem, addModalType, pagination, formValues} = this.state;
    let title = '', that = this;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      /** 修饰数据至接口需要 start */
      items.forEach((v, k) => {
        v = Object.assign(v, v.schoolQuestionnaireItem)
        //v.content = fieldsValue['item-'+k+v.schoolQuestionnaireItem.content]
        delete fieldsValue['item-' + k + v.content]
        delete v.schoolQuestionnaireItem
        v.items.forEach((av, ak) => {
          av = Object.assign(av, av.schoolQuestionnaireItemAnswer)
          //av.content = fieldsValue['item-'+k+'-'+ak+av.content]
          delete fieldsValue['item-' + k + '-' + ak + av.content]
          delete av.schoolQuestionnaireItemAnswer
        });
      });
      // console.log(items);
      // return false;
      /** 修饰数据至接口需要 end */
      
      let values = {};
      if (addModalType === 'edit') {
        values = {
          ...fieldsValue,
          items: items,
          id: addModalItem.id
        };
        console.log(JSON.stringify(values));
        delete values.titleS;
        dispatch({
          type: 'questionnaireInvestigation/uptSchoolQuestionnaireData',
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
        console.log(JSON.stringify(values));
        delete values.titleS;
        dispatch({
          type: 'questionnaireInvestigation/addSchoolQuestionnaireData',
          payload: {
            values: {...values},
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
          type: 'questionnaireInvestigation/delSchoolQuestionnaireData',
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
              type: 'questionnaireInvestigation/delSchoolQuestionnaireData',
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
    dispatch({
      type: 'questionnaireInvestigation/pushWX',
      payload: {
        id: item.id
      },
    });
  }

  detailHide = (flag, item) => {
    const that = this;
    const {dispatch} = this.props;
    if (flag) {
      dispatch({
        type: 'questionnaireInvestigation/resultData',
        payload: {
          id: item.id
        },
        callback: () => {
          that.setState({
            detailVisible: flag,
          });
        },
      });
    } else {
      this.setState({
        detailVisible: flag,
      })
    }


  }

  changeQuesList = (type, key, el) => {
    let resourceData = this.state.resourceData && this.state.resourceData.length > 0 ? this.state.resourceData.slice(0) : []
    if (type === 'plus') {
      // let temp = 0;
      // for (let i = 0; i < resourceData.length; i++) {
      //   if (i === 0) {
      //     temp = resourceData[i].key
      //   } else {
      //     if (resourceData[i].key > resourceData[i - 1].key) {
      //       temp = resourceData[i].key
      //     } else {
      //       temp = resourceData[i - 1].key
      //     }
      //   }

      // }
      resourceData.push({
        items: [
          {
            schoolQuestionnaireItemAnswer: {content: ''},
          }
        ],
        schoolQuestionnaireItem: {content: ''},
        resourceId: null,
      })
    } else {
      resourceData.splice(key, 1)
      // for (let i = 0; i < resourceData.length; i++) {
      //   if (key === resourceData[i].key) {
      //     resourceData.splice(key, 1)
      //     break;
      //   }
      // }
    }
    this.setState({
      resourceData: resourceData
    })
  };

  changeAnsList = (type, key, qkey, el) => {
    let resourceData = this.state.resourceData && this.state.resourceData.length > 0 ? this.state.resourceData.slice(0) : []
    if (type === 'plus') {
      resourceData[key].items.push({
        schoolQuestionnaireItemAnswer: {content: ''},
      })
      // let temp = 0;
      // for (let i = 0; i < resourceData.length; i++) {
      //   if(resourceData[i].key === qkey){

      //     for (let j = 0; j < resourceData[i].items.length; j++) {
      //       if (j === 0) {
      //         temp = resourceData[i].items[j].key
      //       } else {
      //         if (resourceData[i].items[j].key > resourceData[i].items[j - 1].key) {
      //           temp = resourceData[i].items[j].key
      //         } else {
      //           temp = resourceData[i].items[j - 1].key
      //         }
      //       }
      //     }

      //     break;
      //   }
      // }


    } else {
      let keys = key.split('-')
      let [i, j] = keys
      resourceData[i].items.splice(j, 1)
      // for (let i = 0; i < resourceData.length; i++) {
      //   if(resourceData[i].key === qkey){

      //     for (let j = 0; j < resourceData[i].items.length; j++) {
      //       if (key === resourceData[i].items[j].key) {
      //         resourceData[i].items.splice(j, 1)
      //         break;
      //       }
      //     }
      //   }

      // }
    }
    this.setState({
      resourceData: resourceData
    })
  };

  onChangeQues = (val, i) => {
    let resourceData = this.state.resourceData && this.state.resourceData.length > 0 ? this.state.resourceData.slice(0) : []
    if (!resourceData[i].schoolQuestionnaireItem) { //新增数据调整结构至编辑数据一样， 保证数据存
      resourceData[i].schoolQuestionnaireItem = {}
    }
    resourceData[i].schoolQuestionnaireItem.content = val //编辑时保留数据
    this.setState({
      resourceData: resourceData
    })
    // let resourceData = this.state.resourceData && this.state.resourceData.length>0 ? this.state.resourceData.slice(0) : []
    //   for(let i=0; i<resourceData.length; i++){
    //     if(qkey === resourceData[i].key){
    //       resourceData[i].content = val
    //       el && el.id ? resourceData[i].id = el.id : null
    //       break;
    //     }
    //   }

  };
  onChangeAns = (val, i, j) => {
    let resourceData = this.state.resourceData && this.state.resourceData.length > 0 ? this.state.resourceData.slice(0) : []
    if (!resourceData[i].items[j].schoolQuestionnaireItemAnswer) { //新增数据调整结构至编辑数据一样， 保证数据存
      resourceData[i].items[j].schoolQuestionnaireItemAnswer = {};
    }
    resourceData[i].items[j].schoolQuestionnaireItemAnswer.content = val //编辑时保留数据
    this.setState({
      resourceData: resourceData
    })
    // let resourceData = this.state.resourceData && this.state.resourceData.length>0 ? this.state.resourceData.slice(0) : []
    //   for(let i=0; i<resourceData.length; i++){
    //     if(qkey === resourceData[i].key){
    //       for (let j = 0; j < resourceData[i].items.length; j++) {
    //         if (key === resourceData[i].items[j].key) {
    //            resourceData[i].items[j].content = val
    //            el && el.id ? resourceData[i].items[j].id = el.id: null
    //       break;
    //         }
    //       }

    //     }
    //   }
  };

  renderForm() {
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Inputval dispatch={this.props} dataInx={'titleS'} con={'标题'} innerCon={'请输入标题'} maxLength={'15'}
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
    const {questionnaireInvestigation: {loading: ruleLoading, schoolQuestionnaireData, joinUserCount, schoolQuestionnaireItem, resultDataList, resultDataListItems}, form: {getFieldDecorator}} = this.props;
    const {addVisible, addModalTitle, addModalType, itemId, detailVisible, resourceData} = this.state;
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
      <PageHeaderLayout title="问卷调查">
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

            <QuestionnaireInvestigationTable
              loading={ruleLoading}
              data={schoolQuestionnaireData}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              dispatch={this.props.dispatch}
              uptInfo={this.addShow}
              delInfo={this.delInfo}
              handleInfo={this.handleInfo}
              detailInfo={this.detailHide}
            />
          </div>
        </Card>

        <Modal title={'详细'}
               visible={detailVisible}
               onOk={() => this.detailHide(false, {})}
               onCancel={() => this.detailHide(false, {})}
        >
          <div>
            参与人数：{joinUserCount}
          </div>
          {resultDataListItems && resultDataListItems.map((el) => {
            <div key={el.schoolQuestionnaireItem.id}>

              <div>
                题目：{el.schoolQuestionnaireItem.content}
              </div>
              {el.items && el.items.map((item) => {
                <div>
                  结果：{item.schoolQuestionnaireItemAnswer.content} {item.schoolQuestionnaireItemAnswer.choiceCount}
                </div>
              })}
            </div>
          })}


        </Modal>
        {/*新增编辑*/}
        {addVisible ? <Add
          dispatch={this.props}
          addVisible={addVisible}
          addShow={this.addShow}
          addHide={this.addHide}
          addModalTitle={addModalTitle}
          add={this.add}
          itemId={itemId}
          itemDetails={schoolQuestionnaireItem}
          items={resourceData}
          changeQuesList={this.changeQuesList}
          changeAnsList={this.changeAnsList}
          onChangeQues={this.onChangeQues}
          onChangeAns={this.onChangeAns}
        /> : ''}
      </PageHeaderLayout>
    );
  }
}
