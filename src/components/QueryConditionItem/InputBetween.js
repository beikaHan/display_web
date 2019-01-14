//输入框
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

class InputBetween extends PureComponent {

  render() {
    const {getFieldDecorator} = this.props.dispatch.form;
    return (
      <Col {...this.props.size} key={this.props.dataInx} style={{display:'flex',alignItems:'center'}}>
        <div style={{flex:'1',paddingRight:'0.5rem'}}>
          <FormItem label={this.props.con}>
            {getFieldDecorator(`${this.props.dataInx}`,{
                initialValue: this.props.defaultValue?this.props.defaultValue:""
              },`${this.props.telStatue}`?{pattern: /^1\d{10}$/, message: '手机号格式错误！'}:''
            )(
              <Input placeholder={this.props.innerCon} maxLength={this.props.maxLength?this.props.maxLength:'20'}/>
            )}

          </FormItem>
        </div>
        <span>{this.props.wineInfo?this.props.wineInfo:''}</span>
      </Col>
    );
  }
}

export default InputBetween;
