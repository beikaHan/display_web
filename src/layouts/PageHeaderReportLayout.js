import React from 'react';
import { Link } from 'dva/router';
import PageHeaderReport from '../components/PageHeaderReport';
import styles from './PageHeaderReportLayout.less';

export default ({ children, wrapperClassName, top, ...restProps, }) => (
  <div style={{ margin: '-24px -24px 0' }} className={wrapperClassName}>
    {top}
    <PageHeaderReport {...restProps} linkElement={Link}/>
    {children ? <div className={styles.content}>{children}</div> :null}
  </div>
);
