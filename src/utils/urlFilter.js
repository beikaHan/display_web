import Cookie from "./cookie";

const throughWithoutTokenUrl = [
  '/api/ht/login',
  '/api/ht/getMyShopList',
  '/api/ht/intoShopForComm'
]

export function canThrough(url) {
  let canFlag = false;
  for (let i=0; i<throughWithoutTokenUrl.length;i++ ){
    if(url.indexOf(throughWithoutTokenUrl[i]) > -1){
      canFlag = true;
      break;
    }
  }
  return canFlag;
}

//非左侧菜单中的资源路径 父路径或子路径名称
const notInLeftMenu = [
  'user',
  '/personnelManage/teacher-manage',
  '/personnelManage/student-manage',
  '/personnelManage/class-manage',
  '/teachingManage/classified-manage',
  '/teachingManage/video-manage',
  '/teachingManage/audio-manage',
  '/teachingManage/pic-manage',
  '/teachingManage/document-manage',
  '/displayBoardManage/type-manage',
  '/displayBoardManage/content-manage',
  '/itemBankManage/know-points-manage',
  '/itemBankManage/item-manage',
  '/itemBankManage/custom-manage',
  '/itemBankManage/group-manage',
  '/dataStatistics/visitingStatistics',
  '/dataStatistics/capabilityStatistics',
]

export function urlNotInLeft(path) {
  let canFlag = false;
  for (let i=0; i<notInLeftMenu.length;i++ ){
    if(notInLeftMenu[i] == path){
      canFlag = true;
      break;
    }
  }
  return canFlag;
}

export function replaceSelectPath(path) {
  path = path.replace('/personnelManage/teacher-manage', '/personnelManage').replace('/personnelManage/student-manage', '/personnelManage').replace('/personnelManage/class-manage', '/personnelManage');
  path = path.replace('/teachingManage/classified-manage', '/teachingManage').replace('/teachingManage/video-manage', '/teachingManage').replace('/teachingManage/pic-manage', '/teachingManage').replace('/teachingManage/audio-manage', '/teachingManage').replace('/teachingManage/document-manage', '/teachingManage');
  path = path.replace('/displayBoardManage/type-manage', '/displayBoardManage').replace('/displayBoardManage/content-manage', '/displayBoardManage');
  path = path.replace('/itemBankManage/know-points-manage', '/itemBankManage').replace('/itemBankManage/item-manage', '/itemBankManage').replace('/itemBankManage/custom-manage', '/itemBankManage').replace('/itemBankManage/group-manage', '/itemBankManage');
  path = path.replace('/dataStatistics/visitingStatistics', '/dataStatistics').replace('/dataStatistics/capabilityStatistics', '/dataStatistics');
  return path;
}
