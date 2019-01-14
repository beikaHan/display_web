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
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Manage.less';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

const FormItem = Form.Item;

@connect(state => ({
  guideManage: state.guideManage,
}))
@Form.create()
export default class GuideManage extends Component {
  state = {};

  componentDidMount() {

  }

  handleChange = (e) => {
    e.preventDefault();
    console.log(111)
    const {dispatch, form} = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      dispatch({
        type: 'guideManage/addSchoolGuideData',
        payload: values,
        callback: () => {
          this.props.handleShowDishEdit()
        },
      });
    });
  };

  render() {
    const {guideManage: {loading: ruleLoading}, form: {getFieldDecorator}} = this.props;
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
        <div className="ant-upload-text">上传导览图片</div>
      </div>
    );

    const imageUrl = this.state.imageUrl;

    const beforeUpload = (file) => {
      const isJPG = file.type === 'image/jpeg';
      if (!isJPG) {
        message.error('You can only upload JPG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
      }
      return isJPG && isLt2M;
    };

    return (
      <PageHeaderLayout title="导览管理">
        <h1 style={{width: '100%', display: 'block', textAlign: 'center'}}>本功能暂未开放，敬请期待</h1>
      </PageHeaderLayout>
    );
  }
}
/**<Card bordered={false}>
 <Upload
 name="avatar"
 listType="picture-card"
 className="avatar-uploader"
 showUploadList={false}
 action="//jsonplaceholder.typicode.com/posts/"
 beforeUpload={beforeUpload}
 // onChange={this.handleChange}
 >
 {imageUrl ? <img src={imageUrl} alt="avatar"/> : uploadButton}
 </Upload>

 <div>只支持.jpg .png 格式</div>
 <div className={styles.content}>
 <Form onSubmit={this.handleChange} layout="inline">
 <FormItem label="VR导览url" {...formItemLayout} colon={false}>
 {getFieldDecorator('vrUrl', {
                  initialValue: 'VR导览url',
                  rules: [
                    {required: true, message: '请输入VR导览url'},
                    {max: 30, message: '长度不得大于30位'}
                  ],
                })(
                  <Input placeholder={"请输入VR导览url"} maxLength="30" autoComplete="off"/>
                )}
 </FormItem>
 <span style={{width: '100%', display: 'block', textAlign: 'center'}}>
 <Button type="primary" htmlType="submit" onClick={this.handleChange} style={{marginRight: '20px', padding: '0 50px'}}>保存</Button>
 </span>
 </Form>
 </div>
 </Card>  **/
