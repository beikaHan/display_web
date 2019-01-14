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
import StandbyVideoManageTable from '../../components/StandbyVideoManage/StandbyVideoManageTable.js';
import Inputval from "../../components/QueryConditionItem/Inputval.js";
import BtnSearch from "../../components/QueryConditionItem/BtnSearch.js";
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Manage.less';
import moment from 'moment';
import {getCookie} from '../../utils';
import url from '../../utils/ipconfig';

const confirm = Modal.confirm;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const {Option} = Select;
const {TextArea} = Input;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

function getBase64Img(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  // debugger
  // const isMp4 = file.type === 'MP4';
  // if (!isMp4) {
  //   message.error('You can only upload MP4 file!');
  // }
  // // const isLt2M = file.size / 1024 / 1024 < 2;
  // // if (!isLt2M) {
  // //   message.error('Image must smaller than 2MB!');
  // // }
  // // return isJPG && isLt2M;
  // return isMp4;
}

function beforeUploadImg(file) {
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
  standbyVideoManage: state.standbyVideoManage,
}))
@Form.create()
export default class StandbyVideoManage extends Component {
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
    uploading: false,
    thumbnailResourceId: '',
    resourceId: '',
    fileList: []
  };

  componentDidMount() {
    const {dispatch} = this.props;
    const {pagination, formValues} = this.state;

    dispatch({
      type: 'standbyVideoManage/getStandbyVideoList',
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
      type: 'standbyVideoManage/getStandbyVideoList',
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
        type: 'standbyVideoManage/getStandbyVideoList',
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
        type: 'standbyVideoManage/getStandbyVideoItem',
        payload: {
          id: item.id,
        },
        callback: (items) => {
          let fileList = [{
            uid: items.videoResourceId,
            name: items.url.substring(items.url.lastIndexOf("/")+1),
            status: 'done',
          }]
          this.setState({
            fileList: [...fileList]
          });
        }
      });
    } else {
      title = '新增';
      this.setState({
        fileList: []
      });
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
      thumbnailResourceId: '',
      resourceId: '',
      imageUrl: '',
      fileList:[]
    });
    this.props.dispatch({
      type: 'standbyVideoManage/saveCP',
      payload: {
        standbyVideoItem: {}
      },
    });
  };
  add = () => {
    const {dispatch, form} = this.props;
    const {addModalItem, addModalType, pagination, formValues, thumbnailResourceId, resourceId} = this.state;
    let title = '', that = this;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let values = {};
      if (addModalType === 'edit') {
        values = {
          ...fieldsValue,
          id: addModalItem.id,
          adminUserId: addModalItem.adminUserId,
          thumbnailResourceId: thumbnailResourceId && thumbnailResourceId != '' ? thumbnailResourceId : fieldsValue.thumbnailResourceId,
          resourceId: resourceId && resourceId != '' ? resourceId : fieldsValue.resourceId,
        };
        delete values.titleS;
        if (values.previewImageUrl) {
          delete values.previewImageUrl;
        }
        dispatch({
          type: 'standbyVideoManage/uptStandbyVideoData',
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
          thumbnailResourceId: thumbnailResourceId && thumbnailResourceId != '' ? thumbnailResourceId : fieldsValue.thumbnailResourceId,
          resourceId: resourceId && resourceId != '' ? resourceId : fieldsValue.resourceId,
        };
        delete values.titleS;
        if (values.previewImageUrl) {
          delete values.previewImageUrl;
        }
        dispatch({
          type: 'standbyVideoManage/addStandbyVideoData',
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
          type: 'standbyVideoManage/delStandbyVideoData',
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
              type: 'standbyVideoManage/delStandbyVideoData',
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
  

  handleRemove = () => {
    let addModalItem = this.state.addModalItem
    if (addModalItem) {
      addModalItem.resourceId = ''
      this.setState({
        addModalItem: addModalItem
      })
    }
    this.setState({
      uploading: false,
      resourceId: '',
    })
  };

  handleChange = (info) => {
    if (info.fileList.length>1) {
      info.fileList.splice(0,info.fileList.length-1)
    }
    this.setState({ fileList: [...info.fileList] });
    if (info.file.status === 'uploading') {
      this.setState({
        uploading: true
      })
      return;
    }
    if (info.file.status === 'done') {
      this.setState({
        uploading: false,
        resourceId: info.file.response.resource.id
      })
    }
  }
  handleChangeImg = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({loading: true});
      return;
    }
    if (info.file.status === 'done') {
      console.log(info.file.response)
      // Get this url from response in real world.
      getBase64Img(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false,
        thumbnailResourceId: info.file.response.resource.id
      }));
    }
  }

  renderForm() {
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Inputval dispatch={this.props} dataInx={'titleS'} con={'视频名称'} innerCon={'请输入视频名称'} maxLength={'15'}
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
    const {standbyVideoManage: {loading: ruleLoading, standbyVideoData, standbyVideoItem}, form: {getFieldDecorator}} = this.props;
    const {addVisible, addModalTitle, addModalType, imageUrl, resourceId, fileList} = this.state;
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
      <PageHeaderLayout title="待机视频管理">
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

            <StandbyVideoManageTable
              loading={ruleLoading}
              data={standbyVideoData}
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
            <FormItem label="视频标题" {...formItemLayout}>
              {getFieldDecorator('title', {
                  initialValue: addModalType === 'edit' && standbyVideoItem ? standbyVideoItem.title : '',
                  rules: [{
                    required: true,
                    message: '请输入名称',
                  }],
                },
              )(
                <Input placeholder={'请输入待机视频标题'} maxLength={100}/>,
              )}
            </FormItem>
            <FormItem label="简介" {...formItemLayout}>
              {getFieldDecorator('content', {
                  initialValue: addModalType === 'edit' && standbyVideoItem ? standbyVideoItem.content : '',
                },
              )(
                <Input placeholder={'请输入简介'} maxLength={100}/>,
              )}
            </FormItem>
            <FormItem label="状态" {...formItemLayout}>
              {getFieldDecorator('status', {
                  initialValue: addModalType === 'edit' && standbyVideoItem ? standbyVideoItem.status : 1,
                },
              )(
                <RadioGroup>
                  <Radio value={1}>启用</Radio>
                  <Radio value={2}>禁用</Radio>
                </RadioGroup>
              )}
            </FormItem>

            <FormItem label="视频上传" {...formItemLayout}>
              {getFieldDecorator('resourceId', {
                  initialValue: addModalType === 'edit' && standbyVideoItem && standbyVideoItem.url ? standbyVideoItem.url : '',
                  rules: [{
                    required: true,
                    message: '视频上传',
                  }],
                },
              )(
                <Upload
                  name="file"
                  // listType="picture-card"
                  showUploadList={true}
                  onRemove={this.handleRemove}
                  fileList={fileList}
                  listType={`text`}
                  headers={{
                    // 'Content-Type': 'multipart/form-data',
                    'JSESSIONID': getCookie() ? getCookie() : null
                  }}
                  action={`${url.baseURL}/resource/upload`}
                  beforeUpload={beforeUpload}
                  onChange={this.handleChange}>
                  <Button>
                    <Icon
                      type={false ? 'loading' : 'upload'}/> {resourceId ? '已有资源' :standbyVideoItem.url ? '已有资源' : 'Upload'}
                  </Button>
                </Upload>
              )}
            </FormItem>
            <FormItem label="视频要求" {...formItemLayout}>
            <div>不得超过200MB</div>
            </FormItem>
            <FormItem label="缩略图" {...formItemLayout}>
              {getFieldDecorator('thumbnailResourceId', {
                  initialValue: addModalType === 'edit' && standbyVideoItem && standbyVideoItem.thumbnailResourceId ? standbyVideoItem.thumbnailResourceId : '',
                  rules: [{
                    required: true,
                    message: '缩略图',
                  }],
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
                  beforeUpload={beforeUploadImg}
                  onChange={this.handleChangeImg}>
                  {imageUrl ? <img src={imageUrl}
                                   alt="avatar"/> : addModalType === 'edit' && standbyVideoItem && standbyVideoItem.thumbnailUrl ?
                    <img src={standbyVideoItem.thumbnailUrl} alt="avatar"/> : <div>
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
