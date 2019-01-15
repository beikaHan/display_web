import React, { Component } from 'react';
import moment from 'moment';
import { Table, Alert, Badge, Divider, Input } from 'antd';
import styles from './index.less';

class TeacherManageTable extends Component {
  state = {
    selectedRowKeys: [],
  };

  componentWillReceiveProps(nextProps) {}

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const totalCallNo = selectedRows.reduce((sum, val) => {
      return (sum || 0) + parseFloat(val.callNo || 0, 10);
    }, 0);

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }
    this.setState({ selectedRowKeys, totalCallNo });
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };
  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  };

  render() {
    const {
      data: { list, pagination },
      loading,
      selectedRowKeys,
    } = this.props;
    // let {selectedRowKeys} = this.state;
    let columns = [
      {
        title: '题目类型',
        key: 'questionType',
        dataIndex: 'questionType',
        render: (val, item) => {
          return (
            <div className={styles.handle}>
              {val == 1 ? '单选' : val == 2 ? '多选' : val == 3 ? '选择' : '判断'}
            </div>
          );
        },
      },
      {
        title: '题目',
        dataIndex: 'content',
        key: 'content',
      },

      {
        title: '难易度',
        dataIndex: 'level',
        key: 'level',
        render: (val, item) => (
          <div className={styles.handle}>{val == 1 ? '简单' : val == 2 ? '正常' : '困难'}</div>
        ),
      },
    ];
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['10', '20', '50', '100'],
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
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default TeacherManageTable;
