//下拉框
import React, {PureComponent} from 'react';
import {
  Col,
  Form,
  Select,
} from 'antd';
import styles from './common.less';

const FormItem = Form.Item;
const {Option} = Select;

class DropDown extends PureComponent {

  render() {
    const {getFieldDecorator} = this.props.dispatch.form;
    return (
          <Col {...this.props.size} key={this.props.dataInx}>

            <FormItem label={this.props.con}>
              {getFieldDecorator(`${this.props.dataInx}`,{
                initialValue: this.props.defaultValue?this.props.defaultValue:""
              })(
                <Select placeholder={this.props.innerCon} style={{ width: '100%' }} onChange={this.props.onChang ? this.props.onChang : null}>
                  <Option value={''}>全部</Option>
                  {this.props.optObj}
                </Select>
              )}
            </FormItem>


          </Col>
    );
  }
}
export default DropDown;

