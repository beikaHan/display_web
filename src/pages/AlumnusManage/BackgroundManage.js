import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  Pagination,
  Icon,
  Col,
  Button,
  Dropdown,
  Menu,
  Checkbox,
  Modal,
  Upload 
} from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Manage.less';
import Inputval from '../../components/QueryConditionItem/Inputval';
import BtnSearch from '../../components/QueryConditionItem/BtnSearch';
import { getCookie } from '../../utils';
import url from '../../utils/ipconfig';

const confirm = Modal.confirm;
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
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
  alumnusManage: state.alumnusManage,
}))
@Form.create()
export default class BackgroundManage extends Component {
  state = {
    pagination: {
      rows: 10,
      page: 1,
    },
    selectedRows: [],
    isShowImg: false,
    imgId: null,
    imgUrl: null,
    loading: false
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { pagination, formValues } = this.state;
    dispatch({
      type: 'alumnusManage/getClassifyAll',
    });
    dispatch({
      type: 'alumnusManage/getSchoolMaterialList',
      payload: {
        ...pagination,
        ...formValues,
        type: 4,
      },
    });
  }

  handleStandardTableChange = (page, pageSize) => {
    const { dispatch } = this.props;

    const params = {
      page: page,
      rows:pageSize,
    };
    this.setState({
      pagination: {
        page: page,
        rows:pageSize,
      },
    });
    dispatch({
      type: 'alumnusManage/getSchoolMaterialList',
      payload: params,
    });
  };

  showImg = (item, flag) => {
    this.setState({
      isShowImg: flag,
      imgId: item ? item.id : null
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
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
          type: 'alumnusManage/delSchoolMaterialData',
          payload: {
            ids: [item.id],
            searchVal: {
              ...formValues,
              ...pagination,
              type: 4,
            },
          },
        });
      },
      onCancel() {
      },
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
              type: 'alumnusManage/delSchoolMaterialData',
              payload: {
                ids: selectedRows.map(row => row.id),
                searchVal: {
                  ...formValues,
                  ...pagination,
                  type: 4,
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

  handleTabChange = key => {
    const { dispatch } = this.props;
    switch (key) {
      case 'autographManage':
        dispatch(routerRedux.push('/alumnusManage/autograph-manage'));
        break;
      case 'schoolManage':
        dispatch(routerRedux.push('/alumnusManage/school-manage'));
        break;
      case 'backgroundManage':
        dispatch(routerRedux.push('/alumnusManage/background-manage'));
        break;
      default:
        break;
    }
  };

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      console.log(info.file.response);
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
          previewImageResourceId: info.file.response.resource.id,
        }),
      );
    }
  };
  renderForm() {
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Col id={'mediaXl'}>
          <Upload
            name="file"
            listType="picture-card"
            showUploadList={false}
            headers={{
              // 'Content-Type': 'multipart/form-data',
              JSESSIONID: getCookie() ? getCookie() : null,
            }}
            action={`${url.baseURL}/resource/upload`}
            beforeUpload={beforeUpload}
            onChange={this.handleChange}
          >
            <div>
              <Icon type={this.state.loading ? 'loading' : 'plus'}/>
              <div className="ant-upload-text">上传图片</div>
            </div>
          </Upload>
        </Col>
      </Form>

    );

  }

  render() {
    const {
      alumnusManage: { loading: ruleLoading, documentData, documentItem, classifyAllData },
      form: { getFieldDecorator },
    } = this.props;
    const { addVisible, addModalTitle, imgUrl, isShowImg, resourceId } = this.state;
    const mockImgUrl = [];
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="del">批量删除</Menu.Item>
      </Menu>
    );
    let tabList = [
      { key: 'autographManage', tab: '校园校友' },
      { key: 'schoolManage', tab: '校友签名' },
      { key: 'backgroundManage', tab: '签名背景' },
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
                        批量操作 <Icon type="down"/>
                      </Button>
                    </Dropdown>
                  </span>
                </span>
              </Col>
            </div>

            <div>
              {mockImgUrl.map((el) => {
                <div>
                  <Checkbox onChange={() => this.handleSelectRows(el.id)}>{el.id}</Checkbox>
                  <img src={el.imgUrl} alt="" onClick={() => this.showImg(el, true)}/>
                  <Icon type="close" onClick={() => this.delInfo(el.id)}/>
                </div>
              })}
              <Pagination
                showSizeChanger
                showQuickJumper
                onChange={this.handleStandardTableChange}
              />
            </div>
          </div>
        </Card>

        <Modal
          title={''}
          visible={isShowImg}
          onOk={() => this.showImg(null, false)}
          onCancel={() => this.showImg(null, false)}
          className={styles.addModal}
        >
          <img src={imgUrl} alt=""/>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
