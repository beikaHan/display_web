//checkBox框
import React, {PureComponent} from 'react';

import {
  Row,
  Col,
  Form,
  Checkbox,
} from 'antd';

import styles from './common.less';

const FormItem = Form.Item;

//包含赠菜
class CheckBox extends PureComponent {

  render() {
    const {getFieldDecorator} = this.props.dispatch.form;
    return (
          <Col {...this.props.size} style={{height: '39px', top: '8px'}}>
            {getFieldDecorator(`${this.props.dataInx}`)(
              <Checkbox>{this.props.con}</Checkbox>
            )}
          </Col>
    );
  }
}

export default CheckBox;
