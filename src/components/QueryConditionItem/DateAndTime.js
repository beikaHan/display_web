// 筛选条件----date：日期期间
import React, {PureComponent} from 'react';
import moment from 'moment';
import {Form, Select, Col, DatePicker, TimePicker} from 'antd';
import Cookie from "../../utils/cookie";


const FormItem = Form.Item;

class DateAndTime extends PureComponent {
  state = {
    previous: false,
    startDate: moment().subtract(1, 'days'),
    startTime: null,
    endDate: moment().subtract(1, 'days'),
    endTime: null,
    startChangeStatus: false,
    endChangeStatus: false,

  };

  componentDidMount() {
    let openTime = parseInt(localStorage.getItem('openTime'));
    let closeTime =  parseInt(localStorage.getItem('closeTime'));
    // let openTimehour = Math.floor(openTime/60);
    // let openTimeminute= openTime%60;
    let myDate = new Date();
    myDate.getHours(); //获取当前小时数(0-23)
    myDate.getMinutes(); //获取当前分钟数(0-59)
    let currentTime = parseInt(myDate.getHours() * 60 + myDate.getMinutes());
    let closeTimehour = Math.floor(closeTime / 60);
    let closeTimeinute = closeTime % 60;
    const dateFormat = 'YYYY-MM-DD';
    const timeFormat = 'HH:mm';
    let value = {};
    if (currentTime > closeTime) {
      this.setState({
        startTime: moment(`${closeTimehour}:${closeTimeinute}`,timeFormat),
        endTime: moment(`${closeTimehour}:${closeTimeinute}`,timeFormat),
        startDate: moment().subtract(1, 'days'),
        endDate: moment(),
      })
      value = {
        startTime: moment(`${closeTimehour}:${closeTimeinute}`,timeFormat).format('HH:mm'),
        endTime: moment(`${closeTimehour}:${closeTimeinute}`,timeFormat).format('HH:mm'),
        startDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
      }
    } else {
      this.setState({
        startTime: moment(`${closeTimehour}:${closeTimeinute}`,timeFormat),
        endTime: moment(`${closeTimehour}:${closeTimeinute}`,timeFormat),
        startDate: moment().subtract(2, 'days'),
        endDate: moment().subtract(1, 'days'),
      })
      value = {
        startTime: moment(`${closeTimehour}:${closeTimeinute}`,timeFormat).format('HH:mm'),
        endTime: moment(`${closeTimehour}:${closeTimeinute}`,timeFormat).format('HH:mm'),
        startDate: moment().subtract(2, 'days').format('YYYY-MM-DD'),
        endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
      }
    }
    sessionStorage.setItem('shopTimeInfo',JSON.stringify(value));

    let {callBack} = this.props;
    if(callBack)setTimeout(()=>callBack(value),0);
  }

  handleStartOpenChange = () => {
    this.setState({
      startDate: moment().subtract(2, 'days'),
    })
  }
  handleEndOpenChange = () => {
    this.setState({
      endDate: moment().subtract(1, 'days'),
    })
  }
  handleStartTimeOpenChange = () => {
    this.setState({
      startTime: this.state.startTime,
    })
  }
  handleEndTimeOpenChange = () => {
    this.setState({
      endTime: this.state.endTime,
    })
  }
  //开始时间筛选
  timeStartChange = (startTime, timeStrings) => {
    const {getFieldValue, setFields} = this.props.dispatch.form;
    const endTime = getFieldValue('dataAndTime_endTime');
    if (startTime && !this.props.timeFlag) {
      if (!endTime) {
        setFields({"dataAndTime_endTime": {value: moment("23:59", 'HH:mm')}});
      }
    } else {
      setFields({"dataAndTime_endTime": {value: null}});
    }

  };
  //结束日期筛选
  timeEndChange = (endTime, timeStrings) => {
    const {getFieldValue, setFields} = this.props.dispatch.form;
    const startTime = getFieldValue('dataAndTime_startTime');
    if (!this.props.timeFlag) {
      if (endTime) {
        if (!startTime) {
          setFields({"dataAndTime_startTime": {value: moment("00:00", 'HH:mm')}});
        }
      } else {
        setFields({"dataAndTime_startTime": {value: null}});
      }
    }

  };

  // disabledStartDate = (startValue) => {
  //   const {getFieldValue} = this.props.dispatch.form;
  //   const endValue = getFieldValue('dataAndTime_endDate');
  //   if (!startValue || !endValue) {
  //     return false;
  //   }
  //   // return startValue.valueOf() > endValue.valueOf();
  //   var endVal = {};
  //   for (var prop in endValue) {
  //     if (endValue.hasOwnProperty(prop)) {
  //       endVal[prop] = endValue[prop];
  //     }
  //   }
  //   return startValue.valueOf() > endValue.valueOf() || startValue.valueOf() < moment(endVal).subtract(3, "months").valueOf();
  // }
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
    setFields({
      [this.props.dataInx ? `${this.props.dataInx}_dataAndTime_${field}` : `dataAndTime_${field}`]:value
    });
  }

  onStartChange = (value) => {
    this.onChange('startDate', value)
    if (value&&value.valueOf() <= moment(this.state.endDate).subtract(3, "months").valueOf() || value&&value.valueOf() >= moment(this.state.endValue).valueOf()) {
      this.onChange('endDate', value);
    }
  }
  onEndChange = (value) => {
    this.onChange('endDate', value);
    // if (value&&value.valueOf() <= moment(this.state.startDate).subtract(3, "months").valueOf() || value&&value.valueOf() >= moment(this.state.startDate).valueOf()) {
    //   this.onChange('startDate', value);
    // }
  }

  disabledEndDate = (endValue) => {
    // const {getFieldValue} = this.props.dispatch.form;
    // const startValue = getFieldValue('dataAndTime_startDate');
    const startValue = this.state.startDate;
    if (!endValue || !startValue) {
      return false;
    }
    var endVal = {};
    for (var prop in startValue) {
      if (startValue.hasOwnProperty(prop)) {
        endVal[prop] = startValue[prop];
      }
    }
    return endValue&&endValue.valueOf() < startValue.valueOf() || endValue&&endValue.valueOf() >= moment(endVal).add(3, "months").valueOf();
  };


  render() {
    let getFieldDecorator;
    if (this.props.dispatch.dispatch.form) {
      getFieldDecorator = this.props.dispatch.dispatch.form.getFieldDecorator
    } else {
      getFieldDecorator = this.props.dispatch.form.getFieldDecorator
    }
    const dateFormat = 'YYYY-MM-DD';
    const timeFormat = 'HH:mm';
    const {startDate, endDate, startTime, endTime} = this.state;
    // console.log(startDate,startTime,"开始时间");
    // console.log(endDate,endTime,"结束时间");
    return (
      <Col lg={24} xl={16} xxl={12} style={{display: 'flex'}}>
        <FormItem label={this.props.con ? this.props.con : "日期时段" } style={{width: '34%'}}>
          {getFieldDecorator(this.props.dataInx ? `${this.props.dataInx}_dataAndTime_startDate` : `dataAndTime_startDate`, {
            initialValue: this.props.timeFlag ? null : startDate,
          })(
            <DatePicker
              allowClear={this.props.timeFlag?true:false}
              disabledDate={this.disabledStartDate}
              format={dateFormat}
              style={{"marginRight": "10px","marginTop": "3.5px"}}
              onChange={this.onStartChange}
              //value={this.startValue}
              //defaultValue={[moment(), moment()]}
              //onChange={this.dataStartChange}
              onOpenChange={this.handleStartOpenChange}
            />
          )}
        </FormItem>
        <FormItem label="" style={{width: '21%'}}>
          {getFieldDecorator(this.props.dataInx ? `${this.props.dataInx}_dataAndTime_startTime` : `dataAndTime_startTime`, {
            initialValue: this.props.timeFlag ? null : startTime,
          })(
            <TimePicker
              onChange={this.timeStartChange}
              placeholder={'--:--'}
              style={{"marginRight": "6%", width: '94%'}}
              onOpenChange={this.handleStartTimeOpenChange}
              format={timeFormat}/>
          )}
        </FormItem>
        <FormItem label="" style={{width: '1%'}}>
          -
        </FormItem>
        <FormItem label="" style={{width: '21%'}}>
          {getFieldDecorator(this.props.dataInx ? `${this.props.dataInx}_dataAndTime_endDate` : `dataAndTime_endDate`, {
            initialValue: this.props.timeFlag ? null : endDate,
          })(
            <DatePicker
              allowClear={this.props.timeFlag?true:false}
              disabledDate={this.disabledEndDate}
              format={dateFormat}
              style={{"marginLeft": "10px","marginTop": "3.5px"}}
              onChange={this.onEndChange}
              //value={this.endTime}
              //defaultValue={[moment(), moment()]}
              //onChange={this.dataEndChange}
              onOpenChange={this.handleEndOpenChange}
            />
          )}
        </FormItem>
        <FormItem label="" style={{width: '21%'}}>
          {getFieldDecorator(this.props.dataInx ? `${this.props.dataInx}_dataAndTime_endTime` : `dataAndTime_endTime`, {
            initialValue: this.props.timeFlag ? null : endTime
          })(
            <TimePicker
              onChange={this.timeEndChange}
              placeholder={'--:--'}
              style={{"marginLeft": "6%", width: '94%'}}
              onOpenChange={this.handleEndTimeOpenChange}
              format={timeFormat}/>
          )}
          <br/>
        </FormItem>
      </Col>
    );

  }
}

export default DateAndTime;
