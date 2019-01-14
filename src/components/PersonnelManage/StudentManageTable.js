import React, {Component} from 'react';
import moment from 'moment';
import {Table, Alert, Select, Divider, Input} from 'antd';
import styles from './index.less';

const Option = Select.Option;

class StudentManageTable extends Component {
  state = {
    selectedRowKeys: [],
  };

  componentWillReceiveProps(nextProps) {

  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const totalCallNo = selectedRows.reduce((sum, val) => {
      return (sum || 0) + parseFloat(val.callNo || 0, 10);
    }, 0);

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }
    this.setState({selectedRowKeys, totalCallNo});
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }
  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }
  handleInfo = (item) => {
    this.props.handleInfo(item);
  }
  delInfo = (item) => {
    this.props.delInfo(item);
  }
  uptInfo = (type, item) => {
    this.props.uptInfo(type, item);
  }
  detailInfo = (item) => {
    this.props.handleExhibitors(item);
  }

  render() {
    const {data: {list, pagination}, loading} = this.props;
    let {selectedRowKeys} = this.state;
    let columns = [
      {
        title: '学号',
        dataIndex: 'studentNo',
        // fixed:'left',
      },
      {
        title: '班级',
        dataIndex: 'classTitle',
        key: 'classTitle',
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex',
        render: (val, item) => (
          <div>
            {val === 1 ? '男' : val === 2 ? '女' : null}
          </div>
        ),
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '密码',
        dataIndex: 'password',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (val, item) => (
          <div>
            {val === 1 ? '正常' : '禁用'}
          </div>
        ),
      },
      {
        title: '参展记录',
        dataIndex: 'regTime',
        render: (val, item) => (
          <div className={styles.handle}>
            <span style={{cursor: 'pointer'}} onClick={() => this.detailInfo(item)}>详情</span>
          </div>
        ),
      },
      {
        title: '操作',
        key: 'operate',
        align: 'center',
        render: (val, item) => (
          <div className={styles.handle}>
            <span style={{cursor: 'pointer'}}
                  onClick={() => this.handleInfo(item)}>{item.status == 2 ? '启用' : '禁用'}</span>
            <Divider type="vertical"/>
            <span style={{cursor: 'pointer'}} onClick={() => this.delInfo(item)}>删除</span>
            <Divider type="vertical"/>
            <span style={{cursor: 'pointer'}} onClick={() => this.uptInfo('edit', item)}>修改</span>
          </div>
        ),
      },
    ];
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ["10", "20", "50", "100"],
      ...pagination,
    };
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };
    return (
      <div className={`${styles.classManageTable} ${styles.manageTable}`}>
        <Table
          loading={loading}
          rowKey={list => list.id}
          dataSource={list}
          columns={columns}
          rowSelection={rowSelection}
          // scroll={{x: 1500,y:550}}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );

  }
}

export default StudentManageTable;
