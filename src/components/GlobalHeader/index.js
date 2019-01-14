import React, {PureComponent} from 'react';
import {Icon, Select} from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import RightContent from './RightContent';
import {getSchoolInfo, getRole, getschoolId, getSchoolTitle} from '../../utils';

const Option = Select.Option;

export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }

  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }

  toggle = () => {
    const {collapsed, onCollapse} = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };

  handleChange = (e) => {
    this.props.changeSchool(e)

  }

  render() {
    const {collapsed, isMobile, logo} = this.props;
    let schoolList = [], obj = [], sochhoId = ''
    if (getSchoolInfo()) {
      schoolList = JSON.parse(getSchoolInfo())
      sochhoId = getschoolId() ? getschoolId() : schoolList && schoolList[0] ? schoolList[0].id : null

      schoolList.map((el) => {
        obj.push(
          <Option key={el.id} value={parseInt(el.id)}>{el.title}</Option>
        )
      })
    }

    return (
      <div className={styles.header}>
        <Icon
          className={styles.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />
        {getRole() == 'ROLE_admin' ?
          <Select defaultValue={sochhoId ? parseInt(sochhoId) : null} style={{width: 120}} onChange={this.handleChange}>
            {obj}
          </Select> : getSchoolTitle() == 'null' || getSchoolTitle() == null ? '' : getSchoolTitle()}
        <RightContent {...this.props} />
      </div>
    );
  }
}
