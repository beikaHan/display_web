/**
 * 系统配置文件
 */
import packageConfig from '../package.json';

/**
 * 设置不同环境时的配置文件
 */
const setSysConfig = () => {
  let config = {};
  switch (packageConfig.env) {
    // 生产环境
    case 'prod':
      config = {
        baseURL: '',
        WILD_DOG_IO_URL: 'https://wabutler.wilddogio.com',
        SYNC_SOCKET_URL: 'sync.hetangkeji.com',
      };
      break;

    // 验收环境
    case 'prev':
      config = {
        baseURL: '',
        WILD_DOG_IO_URL: 'https://wabutler-test5.wilddogio.com',
        SYNC_SOCKET_URL: 'synct.hetangkeji.com',
      };
      break;

    // 测试环境
    case 'test':
      config = {
        baseURL: '',
        WILD_DOG_IO_URL: 'https://wabutler-test5.wilddogio.com',
        SYNC_SOCKET_URL: 'synct.hetangkeji.com',
      };
      break;
      // WILD_DOG_IO_URL: 'http://10.4.249.142:8090',
      //   SYNC_SOCKET_URL: 'http://10.4.249.142:8080',
    // 本地开发环境
    default:
      config = {
        // baseURL: 'http://10.4.249.141:8080',
        // WILD_DOG_IO_URL: 'http://10.4.249.142:8090',
        // SYNC_SOCKET_URL: 'http://10.4.249.142:8080',

        baseURL: 'https://wt.hetangkeji.com',
        WILD_DOG_IO_URL: 'https://wabutler-test5.wilddogio.com',
        SYNC_SOCKET_URL: 'synct.hetangkeji.com',
      };
      break;
  }
  return config;
};

export default {
  ...setSysConfig(),
};
