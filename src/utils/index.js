
import Cookie from './cookie'

let allPathPowers //缓存 localStorage.getItem('allPathPowers') 数据

// 连字符转驼峰
String.prototype.hyphenToHump = function () {
  return this.replace(/-(\w)/g, function () {
    return arguments[1].toUpperCase()
  })
}

// 驼峰转连字符
String.prototype.humpToHyphen = function () {
  return this.replace(/([A-Z])/g, '-$1').toLowerCase()
}

// 日期格式化
Date.prototype.format = function (format) {
  var o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    'S': this.getMilliseconds()
  }
  if (/(y+)/.test(format)) { format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length)) }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1
        ? o[k]
        : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return format
}

// function equalSet(a, b) {
//     const as = new Set(a)
//     const bs = new Set(b)
//     if (as.size !== bs.size) return false
//     for (var a of as) if (!bs.has(a)) return false
//     return true
// }

// const isLogin = () => {
//   return Cookie.get('user_session') && Cookie.get('user_session') > new Date().getTime()
// }
// const isFromPos = () => {
//   let token = getUrlParam('token_code');
//   if(null != token && "" != token){
//     return true;
//   } else {
//     return false;
//   }
// }
// const isChosenShop = () => {
//   return Cookie.get('shop_id')
// }

const userName = Cookie.get('user_name');
const shopId = Cookie.get('shop_id');


// const setFromPosToken = (token) => {
//   Cookie.set('from_pos_token', token);
// }

// const getFromPosToken = () => {
//   return Cookie.get('from_pos_token');
// }

const hasAuthIn = (key) => {
  const auth = localStorage.getItem('authList');
  if(auth.indexOf(key) > -1){
    return true;
  } else {
    return false;
  }
}

const isGroup = () => {
  const groupId = Cookie.get('group_id');
  const shopId = Cookie.get('shop_id');
  if(null !== groupId && undefined !== groupId && "undefined" !== groupId && "" !== groupId && shopId == 'group'){
    return true;
  } else {
    return false;
  }
}

const setLoginOut = () => {
  Cookie.remove('JSESSIONID');
  Cookie.remove('role');
  localStorage.removeItem('schoolInfo')
   Cookie.remove('UserName')
}

const getCookie = () => {
  return Cookie.get('JSESSIONID');
}

const setLoginIn = (JSESSIONID) => {
  Cookie.set('JSESSIONID', JSESSIONID);
}
const setUserName = (UserName) => {
  Cookie.set('UserName', UserName);
}
const setSchoolTitle = (SchoolTitle) => {
  Cookie.set('SchoolTitle', SchoolTitle);
}
const setRole = (role) => {
  Cookie.set('role', role);
}
const getRole = () => {
  return Cookie.get('role');
}
const setschoolId = (schoolId) => {
  Cookie.set('schoolId', schoolId);
}
const getschoolId = () => {
  return Cookie.get('schoolId');
}
const removeRole = () => {
  return Cookie.remove('role');
}

const setSchoolInfo = (schoolInfo) => {
  localStorage.setItem('schoolInfo', JSON.stringify(schoolInfo));
}

const getSchoolInfo = () => {
  return localStorage.getItem('schoolInfo');
}

const getUserName = () => {
  return Cookie.get('UserName');
}
const getSchoolTitle = () => {
  return Cookie.get('SchoolTitle');
}


// const getUserAuth = () => {
//   return localStorage.getItem('authList')
// }

// const getLoginToken = () => {
//   return localStorage.getItem('loginToken')
// }

// const setChoseShop = (shopId,groupId,shopName,cateringMode,token,authList,trueName) => {
//   if(null == shopId || "" == shopId){
//     Cookie.set('shop_id', 'group');
//   } else {
//     Cookie.set('shop_id', shopId);
//   }
//   Cookie.set('group_id', groupId);
//   Cookie.set('shop_name', shopName);
//   Cookie.set('trueName', trueName);
//   Cookie.set('catering_mode', cateringMode);
//   localStorage.setItem('loginToken', token);
//   localStorage.setItem('authList', authList);
// };

// const setOCTime = (openTime, closeTime) => {
//   localStorage.setItem('openTime', openTime);
//   localStorage.setItem('closeTime', closeTime);
// };

// const setCate = (cate) => {
//   localStorage.setItem('cate', cate);
// };



// const setGroupAndShopList = (shopList,groupList,groupShopList) => {
//   localStorage.setItem('shopList', JSON.stringify(shopList));
//   localStorage.setItem('groupList', JSON.stringify(groupList));
//   localStorage.setItem('groupShopList', JSON.stringify(groupShopList));
// }

// const setDishType = (dishType) => {
//   localStorage.setItem('dishType', JSON.stringify(dishType));
// }



const getGroupShopList = () => {
  return localStorage.getItem('groupShopList');
}

const getCateList = () => {
  return localStorage.getItem('cate');
}

// const getShopList = () => {
//   return localStorage.getItem('shopList');
// }

// const getDishType = () => {
//   return localStorage.getItem('dishType');
// }

// const setShopMode = (shopMode) => {
//   Cookie.set('shopMode', shopMode)
// }

// const isShopMode = () => {
//   return Cookie.get('shopMode')
// }

// const removeShopInfo = () => {
//   Cookie.remove('shop_id');
//   Cookie.remove('shop_name');
//   Cookie.remove('catering_mode');
//   Cookie.remove('trueName');
//   Cookie.remove('group_id');
//   localStorage.removeItem('loginToken');
//   localStorage.removeItem('authList');
//   localStorage.removeItem('shopList');
//   localStorage.removeItem('groupList');
// }


// const checkPower = (optionId, curPowers = []) => {
//   return curPowers.some(cur => cur === optionId)
// }

// const getCurPowers = (curPath) => {
//   if(!allPathPowers) {
//     allPathPowers = JSON.parse(localStorage.getItem('allPathPowers'))
//   }
//   const curPathPower = allPathPowers && allPathPowers[curPath]
//   //cur =2 检测查看页面内容权限
//   if(!curPathPower || !curPathPower.find(cur => cur === 2)) {
//     return false
//   }
//   return curPathPower //返回curPathPower，是为方便页面跳转验证权限后，dispatch当然权限
// }

export {
  Cookie,
  getCookie,
  userName,
  shopId,
  setLoginIn,
  setLoginOut,
  getCateList,
  hasAuthIn,
  getSchoolInfo,
  isGroup,
  setSchoolInfo,
  getGroupShopList,
  setRole,
  getRole,
  removeRole,
  getUserName,
  setUserName,
  getschoolId,
  setschoolId,
  setSchoolTitle,
  getSchoolTitle,
  // getShopList,
  // setDishType,
  // getDishType,
  // setGroupAndShopList,
  // setShopMode,
  // getLoginToken,
  // removeShopInfo,
  // getUserAuth,
  // checkPower,
  // getCurPowers,
  // setChoseShop,
  // setOCTime,
  // isShopMode,
  // setCate,
  // equalSet,
  // isLogin,
  // isChosenShop,
  // isFromPos,
  // setFromPosToken,
  // getFromPosToken,
}
