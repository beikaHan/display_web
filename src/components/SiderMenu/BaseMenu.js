import React, { PureComponent } from 'react';
import { Menu, Icon } from 'antd';
import Link from 'umi/link';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { urlToList } from '../_utils/pathTools';
import { getMenuMatches } from './SiderMenuUtils';
import { isUrl } from '@/utils/utils';
import styles from './index.less';
import { replaceSelectPath, urlNotInLeft } from '../../utils/urlFilter';

const { SubMenu } = Menu;

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = icon => {
  if (typeof icon === 'string' && isUrl(icon)) {
    return <img src={icon} alt="icon" className={styles.icon} />;
  }
  if (typeof icon === 'string') {
    return <Icon type={icon} />;
  }
  return icon;
};

export default class BaseMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.getSelectedMenuKeys = memoizeOne(this.getSelectedMenuKeys, isEqual);
  }

  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = (menusData, parent) => {
      // let menus = [];
      if (!menusData) {
        return [];
      }
      // for(var i=0; i<menusData.length; i++){
      //   // if(menusData[i].children){
      //   //   for(var j=0; j<menusData[i].children.length; j++){
      //   //     if (urlNotInLeft(menusData[i].children[j].path)) {
      //   //       menusData[i].children[j] = []
      //   //     }
      //   //   }
      //   // }
      //   if (!urlNotInLeft(menusData[i].path)) {
      //     menus.push(menusData[i])
      //   }
      // }
      // console.log(menus)
      // return menus
      //
    return menusData
      .filter(item => item.name && !item.hideInMenu && !urlNotInLeft(item.path))
      .map(item => this.getSubMenuOrItem(item, parent))
      .filter(item => item);
  };

  // Get the currently selected menu
  getSelectedMenuKeys = pathname => {
    const { flatMenuKeys } = this.props;
    const ptname = replaceSelectPath(pathname);
    return urlToList(ptname).map(itemPath => getMenuMatches(flatMenuKeys, itemPath).pop());
  };

  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = item => {
    // doc: add hideChildrenInMenu
    if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
      const { name } = item;
      return (
        <SubMenu
          title={
            item.icon ? (
              <span>
                {getIcon(item.icon)}
                <span>{name}</span>
              </span>
            ) : (
              name
            )
          }
          key={item.path}
        >
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      );
    }
    return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>;
  };

  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = item => {
    const { name } = item;
    const itemPath = this.conversionPath(item.path);
    const icon = getIcon(item.icon);
    const { target } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span>{name}</span>
        </a>
      );
    }
    const { location, isMobile, onCollapse } = this.props;
    return (
      <Link
        to={itemPath}
        target={target}
        replace={itemPath === location.pathname}
        onClick={
          isMobile
            ? () => {
                onCollapse(true);
              }
            : undefined
        }
      >
        {icon}
        <span>{name}</span>
      </Link>
    );
  };

  conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };

  render() {
    const {
      openKeys,
      theme,
      mode,
      location: { pathname },
    } = this.props;
    // if pathname can't match, use the nearest parent's key
    let selectedKeys = this.getSelectedMenuKeys(pathname);
    if (!selectedKeys.length && openKeys) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }
    let props = {};
    if (openKeys) {
      props = {
        openKeys,
      };
    }
    const { handleOpenChange, style, menuData } = this.props;
    return (
      <Menu
        key="Menu"
        mode={mode}
        theme={theme}
        onOpenChange={handleOpenChange}
        selectedKeys={selectedKeys}
        style={style}
        className={mode === 'horizontal' ? 'top-nav-menu' : ''}
        {...props}
      >
        {this.getNavMenuItems(menuData)}
      </Menu>
    );
  }
}
