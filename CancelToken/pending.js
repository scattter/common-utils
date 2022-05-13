import Axios from 'axios';

// 下面这个map用来保存发起的请求
const pendings = new Map();
export default {
  /**
   * 移除请求
   * @param {Object} config
   */
  removePending(config) {
    const { method, url, params, data } = config;
    const id = [method, url, JSON.stringify(params), JSON.stringify(data)].join('&');
    // 这里是因为进入页面会请求两次权限和用户信息  暂时先把这两个排除出来
    if (url.endsWith('getMenuPermission') || url.endsWith('get-user-info')) {
      return;
    }
    const cancel = pendings.get(id);
    if (cancel && typeof cancel === 'function') {
      cancel();
      pendings.delete(id);
    }
  },
  
  /**
   * 添加请求
   * @param {Object} config
   */
  addPending(config) {
    const { method, url, params, data } = config;
    const id = [method, url, JSON.stringify(params), JSON.stringify(data)].join('&');
    // 同上理
    if (url.endsWith('getMenuPermission') || url.endsWith('get-user-info')) {
      return;
    }
    config.cancelToken = config.cancelToken || new Axios.CancelToken(cancel => {
      if (!pendings.has(id)) {
        pendings.set(id, cancel);
      }
    });
  },
  
  /**
   * 清空所有pending请求
   */
  clearPending() {
    Object.keys(pendings).forEach(c => pendings[c]());
    pendings.clear();
  }
};
