import React, {Component} from 'react';
import {connect} from 'dva';
import {
  Icon,
  Upload,
  Card,
  Form,
  Button,
  Input,
  Select,
  Modal,
  message,
  Radio,
  notification,
  InputNumber
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import {getCookie} from "../../utils";
import url from "../../utils/ipconfig";
import styles from './Manage.less';
import Inputval from '../../components/QueryConditionItem/Inputval';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

const FormItem = Form.Item;

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
  titleManage: state.titleManage,
}))
@Form.create()
export default class TitleManage extends Component {
  state = {
    items: [{
      key: 0,
      isDefault: 0,
      imageResourceId: null,
      title: null,
      score: null,
      imageUrl: null,
    }],
    loadingImg: {}
  };

  componentDidMount() {
    this.handleCancel();
  }

  changeUploadList = (type, key) => {
    let items = this.state.items && this.state.items.length > 0 ? this.state.items.slice(0) : []
    if (type === 'plus') {
      let temp = 0;
      for (let i = 0; i < items.length; i++) {
        if (i === 0) {
          temp = items[i].key
        } else {
          if (items[i].key > items[i - 1].key) {
            temp = items[i].key
          } else {
            temp = items[i - 1].key
          }
        }

      }
      items.push({
        key: temp + 1,
        isDefault: 0,
        imageResourceId: null,
        title: null,
        score: null,
        imageUrl: null
      })
    } else {
      for (let i = 0; i < items.length; i++) {
        if (key === items[i].key) {
          items.splice(i, 1)
          break;
        }
      }
      if (items.length <= 0) {
        notification.error({
          message: '至少保留一条',
        });
        items.push({
          key: 0,
          isDefault: 0,
          imageResourceId: null,
          title: null,
          score: null,
          imageUrl: null,
        })
      }
    }
    this.setState({
      items: items
    })
  };

  handleresourceChange = (info, key) => {
    let items = this.state.items && this.state.items.length > 0 ? this.state.items.slice(0) : []
    let loadingImg = this.state.loadingImg
    if (info.file.status === 'uploading') {
      loadingImg[key] = true
      this.setState({loadingImg: loadingImg});
      return;
    }
    if (info.file.status === 'done') {
      for (let i = 0; i < items.length; i++) {
        if (key === items[i].key) {
          loadingImg[key] = false
          items[i].key = key;
          items[i].imageResourceId = info.file.response.resource.id;
          items[i].imageUrl = info.file.response.resource.url
          break;
        }
      }

      this.setState({
        loadingImg: loadingImg,
        items: items,
        imageUrl: info.file.response.resource.url
      })
    }
  }
  iptChange = (val, key) => {
    let items = this.state.items && this.state.items.length > 0 ? this.state.items.slice(0) : []
    for (let i = 0; i < items.length; i++) {
      if (key === items[i].key) {
        items[i].score = val
        break;
      }
    }
    this.setState({
      items: items
    })
  }
  titleChange = (e, key) => {
    let items = this.state.items && this.state.items.length > 0 ? this.state.items.slice(0) : []
    for (let i = 0; i < items.length; i++) {
      if (key === items[i].key) {
        items[i].title = e.target.value
        break;
      }
    }
    this.setState({
      items: items
    })
  }
  handleChange = (e) => {
    e.preventDefault()
    let items = this.state.items, hash = {};
    const that = this;
    const {dispatch, form} = this.props;
    if (items.length === 0) {
      if (items[0].imageResourceId == null && items[0].score == null && items[0].title == null) {
        notification.error({
          message: '暂无任何保存信息'
        });
        return
      }
    }
    for (var i = 0; i < items.length; i++) {
      if (items[i].imageResourceId == null || items[i].score == null || items[i].title == null) {
        notification.error({
          message: '请填写完整头衔信息'
        });
        return
      }
      if (hash[items[i].score]) {
        notification.error({
          message: '不能设置重复分数'
        });
        return;
      } else {
        hash[items[i].score] = true;
      }
    }


    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'titleManage/addSchoolRankData',
        payload: {
          items: items,
        },
      });
    })

  }
  handleCancel = () => {
    const that = this;
    this.props.dispatch({
      type: 'titleManage/getSchoolRankList',
      callback: (items) => {
        if (items && items.length > 0) {
          that.setState({
            items: items,
            loadingImg: {}
          })
        }
      }
    });
  };

  render() {
    const {titleManage: {loading: ruleLoading, schoolRankAll}, form: {getFieldDecorator}} = this.props;
    const {items, imageUrl, loadingImg} = this.state;
    const formItemLayout = {
      labelcol: {span: 6},
      wrappercol: {
        xs: {span: 28, offset: 0},
        sm: {span: 10, offset: 0},
      },
    };

    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'}/>
        <div className="ant-upload-text">头衔图片</div>
      </div>
    );

    return (
      <PageHeaderLayout title="头衔管理">
        <Form onSubmit={this.handleChange}>
          {items && items.map((el, idx) => {
            return (

              <div className={styles.upload} key={el.key}>
                <FormItem>
                  {getFieldDecorator(`${el.key}${el.score}${el.imageResourceId}`, {
                    initialValue: el != undefined && el.score != undefined ? el.score : '',
                    rules: [{
                      required: true,
                      message: '请输入头衔分数',
                    }],
                  })(
                    <InputNumber placeholder={'请输入头衔分数'} min={1} style={{width: '100%'}}
                                 onChange={(val) => this.iptChange(val, el.key)}/>
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator(`${el.key}${el.title}`, {
                    initialValue: el != undefined && el.title != undefined ? el.title : '',
                    rules: [
                      {required: true, message: '请输入标题'},
                    ],
                  })(
                    <Input placeholder={'请输入头衔名称'} maxLength="30" autoComplete="off"
                           onChange={(e) => this.titleChange(e, el.key, el.score, el.title)}/>,
                  )}
                </FormItem>

                <Upload
                  name="file"
                  showUploadList={false}
                  listType="picture-card"
                  headers={{
                    // 'Content-Type': 'multipart/form-data',
                    'JSESSIONID': getCookie() ? getCookie() : null
                  }}
                  action={`${url.baseURL}/resource/upload`}
                  beforeUpload={beforeUpload}
                  onChange={(info) => this.handleresourceChange(info, el.key)}>

                  {el != undefined && el.url != undefined ? <img src={el.url} alt="ava"/> : el.imageUrl ?
                    <img src={el.imageUrl} alt="ava"/> : <div>
                      <Icon type={loadingImg[el.key] ? 'loading' : 'plus'}/>
                      <div className="ant-upload-text">Upload</div>
                    </div>}
                </Upload>

                <Button type="danger" ghost style={{float: 'right'}}
                        onClick={() => this.changeUploadList('minus', el.key)}>删除</Button>
              </div>
            )
          })}
          <div style={{width: '100%'}}>
          <div style={{width: '100%',textAlign:'center'}}>图片仅支持jpg或png格式，且大小不超过2MB，尺寸为120*120</div>
            <Button
              style={{width: '100%', marginTop: 16, marginBottom: 8}}
              type="dashed"
              onClick={() => this.changeUploadList('plus')}
              icon="plus"
              id={'mediaBtn'}
            >
              添加
            </Button>
          </div>
          <span style={{width: '100%', display: 'block', textAlign: 'center'}}>
                <Button type="primary" htmlType="submit"
                        style={{marginRight: '20px', padding: '0 50px'}}>保存</Button>

                <Button onClick={this.handleCancel} style={{padding: '0 50px'}}>取消</Button>
              </span>

        </Form>

      </PageHeaderLayout>
    );
  }
}
