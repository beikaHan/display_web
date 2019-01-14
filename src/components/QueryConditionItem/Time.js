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
    let closeTime = parseInt(localStorage.getItem('closeTime'));
    let openTimehour = Math.floor(openTime/60);
    let openTimeminute = openTime%60;
    let myDate = new Date();
    myDate.getHours(); //获取当前小时数(0-23)
    myDate.getMinutes(); //获取当前分钟数(0-59)
    let currentTime = parseInt(myDate.getHours() * 60 + myDate.getMinutes());
    let closeTimehour = Math.floor(closeTime / 60);
    let closeTimeinute = closeTime % 60;

    const timeFormat = 'HH:mm';
    let value = {};
    // if (currentTime > closeTime) {
    //   this.setState({
    //     startTime: moment(`${closeTimehour}:${closeTimeinute}`, timeFormat),
    //     endTime: moment(`${closeTimehour}:${closeTimeinute}`, timeFormat),
    // })
    //   value = {
    //     startTime: moment(`${closeTimehour}:${closeTimeinute}`, timeFormat).format('HH:mm'),
    //     endTime: moment(`${closeTimehour}:${closeTimeinute}`, timeFormat).format('HH:mm'),
    //   }
    // } else {
      this.setState({
        startTime: moment(`${openTimehour}:${openTimeminute}`, timeFormat),
        endTime: moment(`${closeTimehour}:${closeTimeinute}`, timeFormat),
      })
      value = {
        startTime: moment(`${openTimehour}:${openTimeminute}`, timeFormat).format('HH:mm'),
        endTime: moment(`${closeTimehour}:${closeTimeinute}`, timeFormat).format('HH:mm'),
      }
    // }
    sessionStorage.setItem('shopTimeInfo', JSON.stringify(value));

    let {callBack} = this.props;
    if (callBack) setTimeout(() => callBack(value), 0);
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

  render() {
    let getFieldDecorator;
    if (this.props.dispatch.dispatch.form) {
      getFieldDecorator = this.props.dispatch.dispatch.form.getFieldDecorator
    } else {
      getFieldDecorator = this.props.dispatch.form.getFieldDecorator
    }

    const timeFormat = 'HH:mm';
    const { startTime, endTime } = this.state;
    // console.log(startDate,startTime,"开始时间");
    // console.log(endDate,endTime,"结束时间");
    return (
      <Col lg={12} xl={9} xxl={6} style={{display: 'flex'}}>
        <FormItem label={this.props.con}>

        </FormItem>
        <FormItem label={''}>
          {getFieldDecorator(this.props.dataInx ? `${this.props.dataInx}_startTime` : `startTime`, {
            initialValue: this.props.timeFlag ? null : startTime,
          })(
            <TimePicker
              onChange={this.timeStartChange}
              placeholder={'--:--'}
              style={{"marginRight": "6%", width: '94%'}}
              //defaultOpenValue={moment('00:00', timeFormat)}
              format={timeFormat}/>
          )}
        </FormItem>
        <FormItem label="">
          -
        </FormItem>
        <FormItem label="">
          {getFieldDecorator(this.props.dataInx ? `${this.props.dataInx}_endTime` : `endTime`, {
            initialValue: this.props.timeFlag ? null : endTime
          })(
            <TimePicker
              onChange={this.timeEndChange}
              placeholder={'--:--'}
              style={{"marginLeft": "6%", width: '94%'}}
              //defaultOpenValue={moment('23:59', timeFormat)}
              format={timeFormat}/>
          )}
          <br/>
        </FormItem>
      </Col>
    );

  }
}

export default DateAndTime;
