import React, {PureComponent} from 'react';

import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Switch,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Radio,
} from 'antd';

import styles from './common.less';

const FormItem = Form.Item;

//搜索
class BtnSearch extends PureComponent {

  render() {
    return (
      <Col {...this.props.size} style={{top: '3px', height:'50px'}}>
          <span>
            <Button type="primary" htmlType="submit">{this.props.con}</Button>
          </span>
      </Col>
    );
  }
}

export default BtnSearch;
