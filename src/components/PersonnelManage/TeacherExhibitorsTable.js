import React, {Component} from 'react';
import moment from 'moment';
import {Table, Alert, Badge, Divider, Input} from 'antd';
import styles from './index.less';

class TeacherManageTable extends Component {
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
  certificateInfo = (item) => {
    this.props.certificateInfo(item);
  }
  myData = (item) => {
    this.props.myData(item);
  }

  render() {
    const {data: {list, pagination}, loading} = this.props;

    let columns = [
      {
        title: '分数',
        dataIndex: 'score',
      },
      {
        title: '排名',
        dataIndex: 'rank',
        key: 'rank',
      },
      {
        title: '头衔',
        dataIndex: 'rankTitle',
      },
      {
        title: '证书',
        dataIndex: 'certificateUrl',
        render: (val, item) => (
          <div className={styles.handle}>
            {val ? <span style={{cursor: 'pointer'}}>
            <a href={val} target='_blank'>预览</a>
            </span> : null}
          </div>
        ),
      }
    ];
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ["10", "20", "50", "100"],
      ...pagination,
    };

    return (
      <div className={`${styles.classManageTable} ${styles.manageTable}`}>
        <Table
          loading={loading}
          rowKey={list => list.id}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default TeacherManageTable;
