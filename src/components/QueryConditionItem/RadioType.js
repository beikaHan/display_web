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

//统计方式和菜品名称
class RadioType extends PureComponent {
  state = {
    // mode: 'dishType',
  };

  render() {
    const {mode,item} = this.state;
    const {getFieldDecorator} = this.props.dispatch.dispatch == undefined?this.props.dispatch.dispatch.form:this.props.dispatch.form;
    //统计方式
    const handleSizeChange = (e) => {
      // this.setState({mode: e.target.value});
      this.props.handleSizeChange(e.target.value)
    }
    return (
        <Col {...this.props.size}>
          <FormItem label={this.props.con}>
            {getFieldDecorator(this.props.mode)(
              <div><Radio.Group value={this.props.mode} onChange={(e) => handleSizeChange(e)}>{this.props.optObj}</Radio.Group></div>
            )}
          </FormItem>
        </Col>
    );
  }
}

export default RadioType;
