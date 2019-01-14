import React, {Component} from 'react';
import moment from 'moment';
import {Table, Alert, Badge, Divider, Modal} from 'antd';
import styles from './index.less';
// import Qrcodemodal from './Qrcodemodal';
// import reqwest from 'reqwest';

class ClassManageTable extends Component {
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

  // previewQrcode = (item) =>{
  //   Modal.info({
  //     title: '预览二维码',
  //     content: <Qrcodemodal qrcodeText={item.url}/>
  //   });
  // };
  // 下载二维码
  downloadQrcode = (item) => {
    this.props.downloadQrcode(item)
  };

  render() {
    const {data: {list, pagination}, loading} = this.props;
    let {selectedRowKeys} = this.state;
    let columns = [
      {
        title: '图片',
        dataIndex: 'previewImageUrl',
        key: 'previewImageUrl',
        render: (val, item) => {
          return <img src={val} height='50' weight='50' alt=''/>
        }
      },
      {
        title: '学校',
        dataIndex: 'title',
        key: 'title',
        render: (val, item) => (
          <div className={styles.handle}>
            <div>{item.title}</div>
            <div>网址：{item.websiteUrl}</div>
            <div>联系方式：{item.contact}</div>
          </div>
        ),
      },
      {
        title: '简介',
        dataIndex: 'content',
        key: 'content',
      },
      {
        title: '地址',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '账号',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: '密码',
        dataIndex: 'password',
        key: 'password',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (val, item) => (
          <div>
            {val == 2 ? '停用' : '启用'}
          </div>
        ),
      },
      {
        title: '二维码',
        dataIndex: 'url',
        key: 'url',
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
            <span style={{cursor: 'pointer'}}
                  onClick={() => this.handleInfo(item)}>{item.status == 2 ? '启用' : '停用'}</span>
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

export default ClassManageTable;
