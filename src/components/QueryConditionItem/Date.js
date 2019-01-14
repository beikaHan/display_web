// 筛选条件----date：日期期间
import React, {PureComponent} from 'react';
import moment from 'moment';
import {Form, Select, Col, DatePicker, notification} from 'antd';
import styles from './common.less';

const RangePicker = DatePicker.RangePicker;


const FormItem = Form.Item;

class Date extends PureComponent {
  state = {
    startValue: moment().subtract(1, 'days'),
    endValue: moment().subtract(1, 'days'),
    endOpen: false,
  }
  // disabledStartDate = (startValue) => {
  //   const endValue = this.state.endValue;
  //   if (!startValue || !endValue) {
  //     return false;
  //   }
  //   var endVal = {};
  //   for (var prop in endValue) {
  //     if (endValue.hasOwnProperty(prop)) {
  //       endVal[prop] = endValue[prop];
  //     }
  //   }
  //   return startValue.valueOf() > endValue.valueOf() || startValue.valueOf() < moment(endVal).subtract(3, "months").valueOf();
  // }

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    var endVal = {};
    for (var prop in startValue) {
      if (startValue.hasOwnProperty(prop)) {
        endVal[prop] = startValue[prop];
      }
    }
    return endValue.valueOf() < startValue.valueOf() || endValue.valueOf() >= moment(endVal).add(3, "months").valueOf();
  }

  onChange = (field, value) => {
    // this.props.dispatch.form.resetFields();
    this.setState({
      [field]: value,
    });
    let setFields;
    if (this.props.dispatch.dispatch.form) {
      setFields = this.props.dispatch.dispatch.form.setFields
    } else {
      setFields = this.props.dispatch.form.setFields
    }
    let name;
    switch (field) {
      case "startValue":
        name = "beginDate";
      case "endValue":
        name = "endDate";
    }
    setFields({
      [name]: value
    });
  }

  onStartChange = (value) => {
    this.onChange('startValue', value);
    if (value.valueOf() <= moment(this.state.endValue).subtract(3, "months").valueOf() || value.valueOf() >= moment(this.state.endValue).valueOf()) {
      this.onChange('endValue', value);
    }
  }
  onEndChange = (value) => {
    this.onChange('endValue', value);
  }

  handleStartOpenChange = (open) => {
    if (!open) {
      // this.props.dispatch.form.resetFields();
      this.setState({
        startValue: moment().subtract(1, 'days'),
        endOpen: true,
      });
    }
  }

  handleEndOpenChange = (open) => {
    // this.props.dispatch.form.resetFields();
    this.setState({
      endValue: moment().subtract(1, 'days'),
      endOpen: open,
    });
  }


  render() {
    let getFieldDecorator;
    if (this.props.dispatch.dispatch.form) {
      getFieldDecorator = this.props.dispatch.dispatch.form.getFieldDecorator
    } else {
      getFieldDecorator = this.props.dispatch.form.getFieldDecorator
    }
console.log(this.props.size)
    const {startValue, endValue, endOpen} = this.state;
    return (
      <Col lg={this.props.size?this.props.size.lg:12} xl={this.props.size?this.props.size.xl:9} xxl={this.props.size?this.props.size.xxl:6} style={{display: 'flex'}} id='dateStrikethrough'>
        <FormItem label={this.props.con}>

        </FormItem>
        <FormItem label={''}>
          {getFieldDecorator(`beginDate`, {
            initialValue: startValue,
          })(
            <DatePicker
              allowClear={false}
              format="YYYY-MM-DD"
              placeholder='请选择时间'
              onChange={this.onStartChange}
              onOpenChange={this.handleStartOpenChange}
            />
          )}
        </FormItem>
        <FormItem label="">
          -
        </FormItem>
        <FormItem label="">
          {getFieldDecorator(`endDate`, {
            initialValue: endValue,
          })(
            <DatePicker
              allowClear={false}
              disabledDate={this.disabledEndDate}
              format="YYYY-MM-DD"
              placeholder='请选择时间'
              onChange={this.onEndChange}
              open={endOpen}
              onOpenChange={this.handleEndOpenChange}
            />
          )}
          <br/>
        </FormItem>
      </Col>
    );

  }
}

export default Date;
