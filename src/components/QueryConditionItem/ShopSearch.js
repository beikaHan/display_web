import React, {PureComponent} from 'react';
import moment from 'moment';
import {Table, Alert, Badge, Divider, Input, Form, Select, Col, Checkbox, TreeSelect} from 'antd';

const {Option} = Select;
import styles from './common.less';
import {getCateList, getGroupShopList} from "../../utils";
import Cookie from "../../utils/cookie";

const FormItem = Form.Item;
const initialValue = Option.initialValue;
const CheckboxGroup = Checkbox.Group;
const statusMap = ['Error', 'Processing'];
const plainOptions = [];
const defaultCheckedList = ['Apple', 'Orange'];
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

class ShopList extends PureComponent {
  state = {
    selectedRowKeys: [],
    totalCallNo: 0,
    checkedList: [],
    indeterminate: true,
    checkAll: false,
    len: 0,
    value: ['0-0'],
    cateChild: [],
    cateArr: [],
    cateChilds: [],
    cateObj: JSON.parse(getGroupShopList()),
  };

  componentDidMount() {
    let cateChilds = [];
    let cateList = JSON.parse(getCateList())
    for (var i = 0; i < cateList.length; i++) {
      cateChilds.push({label: cateList[i].cate_name, value: cateList[i].cate_id, key: cateList[i].cate_id})
    }
    this.setState({
      cateChild: cateChilds,
      cateChilds: cateChilds,
    })
  }

  onChange = (value) => {
    this.setState({value});
    if (this.props.handleGetName) {
      this.props.handleGetName(value)
    }
    const {getFieldValue, resetFields} = this.props.dispatch.form;
    const arr = JSON.parse(getGroupShopList());
    let arr2;
    if (value && value.length > 0) {
      //先判断value数组内部数据类型
      if (value[1]) {
        arr2 = value
      } else {
        arr2 = value[0].split(',')
      }

      let cateArr = [], shopArr = [];
      let cateObj = {};
      if (arr2) {
        for (var i = 0; i < arr2.length; i++) {
          for (var j = 0; j < arr.length; j++) {
            if (arr2[i] == arr[j].shopId) {
              //选出选中的shopId相对应的cateId，并确保唯一
              shopArr.push({shopId: arr[j].shopId, cateId: arr[j].cateId})
              cateObj[arr[j].cateId] = arr[j].shopId
            }
          }
        }
      }
      //把唯一的cateId放入数组中
      for (var key in cateObj) {
        cateArr.push(key)
      }
      let cateChildss = [];
      let cateList = JSON.parse(getCateList())
      for (var i = 0; i < cateList.length; i++) {
        for (var j = 0; j < cateArr.length; j++) {
          if (cateArr[j] == cateList[i].cate_id) {
            //把相对应的cateId，push新数组中为treeData赋值
            cateChildss.push({label: cateList[i].cate_name, value: cateList[i].cate_id, key: cateList[i].cate_id})
          }
        }
      }
      resetFields('cate')
      resetFields('mtid')
      this.setState({
        cateChild: cateChildss,
        cateObj: shopArr,
      })
    } else {
      resetFields('cate')
      resetFields('mtid')
      this.setState({
        cateChild: this.state.cateChilds,
        cateObj: {},
      })
    }
  };

  onCateChange = (value) => {
    const {getFieldValue, setFieldsValue} = this.props.dispatch.form;
    const arr = this.state.cateObj;

    let arr2 = [];
    if (value && value.length > 0) {
      if (value[1]) {
        arr2 = value
      } else {
        arr2 = value[0].split(',')
      }
      let cateArr = [];
      if (arr2) {
        for (var i = 0; i < arr2.length; i++) {
          for (var j = 0; j < arr.length; j++) {
            if (arr2[i] == arr[j].cateId) {
              cateArr.push(arr[j].shopId)
            }
          }
        }
      }

      setFieldsValue({
        mtid: cateArr,
      });
    } else {
      setFieldsValue({
        mtid: getFieldValue('shop'),
      });
    }
  };

  render() {
    const {getFieldDecorator} = this.props.dispatch.form;
    let shopList = JSON.parse(getGroupShopList());

    let shopChild = [];
    for (var i = 0; i < shopList.length; i++) {
      shopChild.push({label: shopList[i].shopName, value: shopList[i].shopId, key: shopList[i].shopId})
    }
    const shopData = [{
      label: '全部',
      value: JSON.parse(getGroupShopList()).map(row => row.shopId).join(','),
      key: JSON.parse(getGroupShopList()).map(row => row.shopId).join(','),
      children: shopChild,
    }];

    const cateData = [{
      label: '全部',
      value: this.state.cateChild.map(row => row.key).join(','),
      key: this.state.cateChild.map(row => row.key).join(','),
      children: this.state.cateChild,
    }];

    const shopProps = {
      treeData: shopData,
      onChange: this.onChange,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: '选择店铺',
      treeDefaultExpandAll: true,
      style: {
        overflow: 'hidden',
      },
    };

    const cateProps = {
      treeData: cateData,
      onChange: this.onCateChange,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: "选择行业类别",
      treeDefaultExpandAll: true,
      style: {
        overflow: 'hidden',
      },
    };
    const {isShow: {cate, shop}} = this.props;
    return (
      <div style={this.props.styles ? {...this.props.styles} : null}>
        {shop ? <Col {...this.props.size} id='shopSelect'>
          <FormItem label={this.props.shopName ? this.props.shopName : "店铺"}>
            {getFieldDecorator('shop', {
              initialValue: this.props.shopListAuthKey?this.props.shopListAuthKey:JSON.parse(getGroupShopList()).map(row => row.shopId),
              rules: [{
                required: this.props.rules, message: '请选择店铺',
              }],
            })(
              <TreeSelect {...shopProps} />
            )}
          </FormItem>
        </Col> : null}
        {cate ? <Col {...this.props.size} id='shopSelect'>
          <FormItem label="行业分类">
            {getFieldDecorator('cate')(
              <TreeSelect {...cateProps} />
            )}
          </FormItem>
        </Col> : null}
        {cate ? <Col style={{display: 'none'}}>
          <FormItem label="">
            {getFieldDecorator('mtid')(
              <div></div>
            )}
          </FormItem>
        </Col> : null}
      </div>
    );
  }
}

export default ShopList;
