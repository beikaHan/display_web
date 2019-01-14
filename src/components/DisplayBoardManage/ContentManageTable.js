import React, {Component} from 'react';
import moment from 'moment';
import {Table, Alert, Select, Divider, Input} from 'antd';
import styles from './index.less';

const Option = Select.Option;

class ContentManageTable extends Component {
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
  downloadQrcode = (item) => {
    this.props.downloadQrcode(item)
  };

  render() {
    const {data: {list, pagination}, loading} = this.props;
    let {selectedRowKeys} = this.state;
    let columns = [
      {
        title: '图片',
        dataIndex: 'thumbnailUrl',
        key: 'thumbnailUrl',
        render: (val, item) => {
          return <a href={val} target='_blank'><img src={val} height='50' weight='50' alt=''/></a>
        }
      },
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: '描述',
        dataIndex: 'content',
        key: 'content',
      },
      {
        title: '分类',
        dataIndex: 'classifyTitle',
        key: 'classifyTitle',
        className: styles.allWidth,
      },
      {
        title: '提示语',
        dataIndex: 'alertContent',
        key: 'alertContent',
      },
      {
        title: '二维码',
        dataIndex: 'qrCode',
        render: (val, item) => (
          <div className={styles.handle}>
            <span style={{cursor: 'pointer'}} onClick={() => this.downloadQrcode(item)}>下载</span>
            <Divider type="vertical"/>
            <span style={{cursor: 'pointer'}} onClick={() => this.downloadQrcode(item)}>预览</span>
          </div>
        ),
      },
      {
        title: '操作',
        key: 'operate',
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

export default ContentManageTable;
