import React, {Component} from 'react';
import moment from 'moment';
import {Table, Alert, Badge, Divider, Input} from 'antd';
import styles from './index.less';

const statusMap = ['Error', 'Processing'];

class TaskManageTable extends Component {
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

  render() {
    const {data: {list, pagination}, loading} = this.props;
    let {selectedRowKeys} = this.state;
    let columns = [
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        className: styles.allWidth,
      },
      {
        title: '描述',
        dataIndex: 'content',
        key: 'content',
        className: styles.allWidth,
      },
      {
        title: '难易度',
        dataIndex: 'level',
        key: 'level',
        className: styles.allWidth,
        render: (val, item) => (
          <div className={styles.handle}>
            {val == 1 ? '简单' : val == 2 ? '正常' : '困难'}
          </div>
        ),
      },
      {
        title: '触发方式',
        dataIndex: 'targetType',
        key: 'targetType',
        className: styles.allWidth,
        render: (val, item) => {
          return (
            <div className={styles.handle}>
              {val == 3 ? `分数：${item.targetScore}` : val == 1 ? '默认' : val == 2 ? '头衔触发' : '进入展厅'}
            </div>
          )
        },
      },
      {
        title: '操作',
        key: 'operate',
        className: styles.brtWidth,
        align: 'center',
        render: (val, item) => (
          <div className={styles.handle}>
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

export default TaskManageTable;
