import React, {Component} from 'react';
import {Table, Button, Input, Switch, Popconfirm, Divider, Radio, Checkbox, Select} from 'antd';
import styles from './style.less';
import {connect} from 'dva';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const InputGroup = Input.Group;

@connect(state => ({
  taskManage: state.taskManage,
}))
export default class RemarkTableForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.value,
      chooseType: {},
      flag: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        data: nextProps.value,
      });
    }
  }

  getRowByKey(key) {
    return this.state.data.filter(item => item.key === key)[0];
  }

  index = 2;
  cacheOriginData = {};
  handleSubmit = (e) => {
    this.props.onChange(this.state.data);
  }

  toggleEditable(e, key) {
    e.preventDefault();
    const target = this.getRowByKey(key);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = {...target};
      }
      target.editable = !target.editable;
      this.setState({data: [...this.state.data]});
    }
  }

  remove(key) {
    const newData = this.state.data.filter(item => item.key !== key);
    this.setState({data: newData});
    this.props.onChange(newData);
  }

  newMember = () => {
    const newData = [...this.state.data];
    newData.push({
      key: `${this.index}`,
      type: 1,
      relationId: null,
      resourceId: null,
      isDirectShow: null,
      isNew: true,
      resourceList: []
    });
    this.index += 1;
    this.setState({data: newData});
    this.props.onChange(newData);
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleFieldChange(e, fieldName, key, type, relationId) {
    const newData = [...this.state.data];
    const target = this.getRowByKey(key);
    let flag = {}
    if (target) {
      let arrKey = newData.findIndex((value) => {
        return value.key == key
      });
      if (fieldName == "type") {
        flag[key] = true;
        this.props.dispatch({
          type: 'taskManage/getRecourseList',
          payload: {
            type: type.target ? type.target.value : type
          },
          callback: (resourceList) => {
            console.log(relationId)
            newData[arrKey].relationId = relationId ? relationId : resourceList && resourceList[0] ? resourceList[0].id : '';
            newData[arrKey].resourceList = resourceList;
            target[fieldName] = type.target ? type.target.value : type
            console.log(flag)
            this.setState({data: newData, flag: flag});
            this.props.onChange(newData);
          }
        });
      } else {
        // newData[arrKey].relationId = resourceList && resourceList[0] ? resourceList[0].id : '';
        // newData[arrKey].resourceList = resourceList;
        target[fieldName] = e.target ? e.target.value : e;
        debugger
        this.setState({data: newData});
        this.props.onChange(newData);

      }
    }
  }

  saveRow(e, key) {
    e.persist();
    // save field when blur input
    setTimeout(() => {
      if (document.activeElement.tagName === 'INPUT' &&
        document.activeElement !== e.target) {
        return;
      }
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      // if (!target.name || !target.menuCommentList) {
      //   message.error('请填写完整备注信息。');
      //   e.target.focus();
      //   return;
      // }
      delete target.isNew;
      this.toggleEditable(e, key);
      this.props.onChange(this.state.data);
    }, 10);
  }

  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const target = this.getRowByKey(key);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      target.editable = false;
      delete this.cacheOriginData[key];
    }
    this.setState({data: [...this.state.data]});
  }

  onChange = (e, idx) => {
    let chooseType = this.state.chooseType;
    chooseType[idx] = e.target.value;
    this.setState({
      chooseType: chooseType,
    })
  };
  recourseObj = (recourseList) => {
    let obj = []
    recourseList && recourseList.map((el) => {
      obj.push(
        <Select.Option value={el.id} key={el.id}>{el.title}</Select.Option>
      )
    })
    return obj
  }

  render() {
    const {itemId} = this.props
const {flag} = this.state;
    let columns = []
    columns = [{
      title: '',
      dataIndex: 'type',
      key: 'type',
      width: '50%',
      render: (text, record) => {
        return (
          <div>
            <RadioGroup onChange={(e) => this.handleFieldChange(e, 'type', record.key, e)} value={record.type}>
              <RadioButton value={1}>随机组题</RadioButton>
              <RadioButton value={2}>知识点组题</RadioButton>
              <RadioButton value={9}>自定义组题</RadioButton>
            </RadioGroup>
            <RadioGroup onChange={(e) => this.handleFieldChange(e, 'type', record.key, e)} style={styles.typeResc}
                        value={record.type}>
              <RadioButton value={3}>图片</RadioButton>
              <RadioButton value={4}>视频</RadioButton>
              <RadioButton value={5}>音频</RadioButton>
              <RadioButton value={6}>文档</RadioButton>
              <RadioButton value={7}>展板</RadioButton>
            </RadioGroup>
          </div>
        );
      },
    }, {
      title: '',
      dataIndex: 'relationId',
      key: 'relationId',
      width: '50%',
      render: (text, record) => {
        return (
          <div>
            {record.type == 7 ?
              <div style={{marginBottom: '20px'}}>扫扫展板
                <RadioGroup
                  defaultValue={record.isDirectShow ? record.isDirectShow : 2}
                  onChange={(e) => this.handleFieldChange(e, 'isDirectShow', record.key)}>
                  <Radio value={1}>是</Radio>
                  <Radio value={2}>否</Radio>
                </RadioGroup></div>
              : null}
            {record.type != 1 && record.type != 2 ?
              flag[record.key] || record.isNew || itemId == undefined?
              <Select
                placeholder="请选择"
                key={record.key}
                onChange={(e) => this.handleFieldChange(e, 'relationId', record.key)}
                value={record.relationId ? record.relationId : ''}>
                {this.recourseObj(record.resourceList)}
              </Select> : '可修改资源'
              : null}
          </div>
        );
      },
    }, {
      title: '',
      key: 'action',
      render: (text, record) => {
        return (
          <div style={{width:'140px'}}>
            {(itemId != undefined && record.resourceList== undefined) || !flag[record.key]?
              <Button type="danger"
                      onClick={(e) => this.handleFieldChange(e, 'type', record.key, record.type, record.relationId)}
                      style={{marginRight:'8px'}}>
                编辑
              </Button> : null}
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
              <Button type="danger" ghost>删除</Button>
            </Popconfirm>
          </div>

        )
      },
    }]


    return (
      <div className={styles.dishAddTableForm}>
        <Table
          columns={columns}
          dataSource={this.state.data}
          pagination={false}
          rowKey={(record) => {
            if (record.key) {
              return record.key;
            }
            return record.id;
          }}
          rowClassName={(record) => {
            return styles.editables;
          }}
          showHeader={false}
        />
        <Button
          style={{width: '100%', marginTop: 16, marginBottom: 8}}
          type="dashed"
          onClick={this.newMember}
          icon="plus"
          id={'mediaBtn'}
        >
          添加任务
        </Button>

      </div>
    );
  }
}
