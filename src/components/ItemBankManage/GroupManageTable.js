import React, {Component} from 'react';
import moment from 'moment';
import {Table, Alert, Badge, Divider, Input} from 'antd';
import styles from './index.less';

const statusMap = ['Error', 'Processing'];
class ClassManageTable extends Component {
  state = {

  };
  componentWillReceiveProps(nextProps) {

  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }
  editVipInfo =  (item) => {
    this.props.editVipInfo(item);
  }
  delVipInfo =  (item) => {
    this.props.editVipInfo(item);
  }
  render() {
    const {data:{list,pagination}, loading} = this.props;
    let columns = [
      {
        title: '班级名称',
        dataIndex: 'tel',
        key:'tel',
        className: styles.allWidth,
        render: (val, item) => (
          <div className={styles.handle}>
            <Input placeholder="班级名称" />
          </div>
        ),
      },
      {
        title: '操作',
        key:'operate',
        className: styles.brtWidth,
        align:'center',
        render: (val, item) => (
          <div className={styles.handle}>
            <span style={{cursor:'pointer'}} onClick={()=>this.editVipInfo(item)}>删除</span>
            <Divider type="vertical" />
            <span style={{cursor:'pointer'}} onClick={()=>this.delVipInfo(item)}>保存</span>
          </div>
        ),
      },
    ];
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions:["10","20","50","100"],
      ...pagination,
    };

    return (
      <div className={`${styles.classManageTable} ${styles.manageTable}`}>
        <Table
          loading={loading}
          rowKey={list => list.userId}
          dataSource={list}
          columns={columns}
          // scroll={{x: 1500,y:550}}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );

  }
}
export default ClassManageTable;
