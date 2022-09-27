import axios from 'axios';
import { Message } from 'element-ui';
import qs from 'qs';

import auth, { getProjectId, goHome, Token } from '@/utils/auth';

import pending from './pending';

const Config = {
  baseUrl: '/api/v1/'
};

// 补全URL路径
// 除以下两种情况，都会增加Config.baseUrl前缀
//   1。 以http:// or https://开头
//   2。 以 / 开头
function getUrl(sUrl) {
  // 以 / 开头的路径不需增加前缀
  if (sUrl.charAt(0) === '/') {
    return sUrl;
  }
  
  // 以http:// or https://开头的路径不需增加前缀
  if (/^https?:\/\//.test(sUrl)) {
    return sUrl;
  }
  
  // 所有的相对路径都要增加前缀
  return `${Config.baseUrl}${sUrl}`;
}

function showError(errMsg) {
  const sMsg = errMsg || 'Error';
  Message({
    message: sMsg,
    type: 'error',
    duration: 5 * 1000
  });
  
  return Promise.reject(new Error(sMsg));
}

function go401() {
  // window.history.pushState({}, '', '#/401');
  // router.push('/401');
  window.location.href = '#/401';
}

// create an axios instance
const service = axios.create({
  // baseURL: Config.baseUrl,
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 15000, // request timeout
  paramsSerializer: function(params) {
    return qs.stringify(params, { arrayFormat: 'brackets' });
  }
});

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    
    if (config.method === 'get') {
      // 如果是get请求，且params是数组类型如arr=[1,2]，则转换成arr=1&arr=2
      config.paramsSerializer = function(params) {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      };
    }
    
    // 产品视图中必须是登录后访问，因此肯定存在token
    config.headers.common['Authorization'] = Token.get();
    
    // 产品视图时，header中需要增加projectId
    config.headers.common['projectId'] = getProjectId() || '';
    
    pending.removePending(config); // 在请求开始前，对之前的请求做检查取消操作
    pending.addPending(config); // 将当前请求添加到 pending 中
    
    return config;
  },
  error => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */
  
  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    pending.removePending(response.config); // 在请求结束后，移除本次请求
    if (response.headers['content-type'] !== 'application/json') {
      return response;
    }
    const res = response.data;
    const resCode = res.code;
    if (resCode === 20000) {
      return res;
    }
    
    // 状态码202xx为无效token,重新登录
    if (resCode >= 20200 && resCode < 20300) {
      auth.clear();
      return goHome(true);
    }
    
    // 没有权限，进入401页面
    if (resCode === 20501) {
      return go401(res);
    }
    
    // if the custom code is not 20000, it is judged as an error.
    return showError(res.message);
  },
  error => {
    if (axios.isCancel(error)){}
    console.log('err' + error); // for debug
    return showError(error.message);
  }
);

export default service;

export function get(sUrl, params, config = {}) {
  return service.get(getUrl(sUrl), { params, ...config });
}

export function post(sUrl, data, config = {}) {
  return service.post(getUrl(sUrl), data, config);
}
