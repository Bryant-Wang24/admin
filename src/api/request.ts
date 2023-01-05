import axios from 'axios';
import { Message} from '@arco-design/web-react';

export const request = (config) => {
  const http = axios.create({
    baseURL: '/api/v1',
    // timeout: 5000,
  });

  // 请求拦截
  http.interceptors.request.use(
    (config) => {
      if (config.method === 'delete') {
        const id = config.data._id || config.data.id;
        config.url += `/${id}`;
      }
      console.log('config', config);
      const token = localStorage.getItem('token');
      config.headers = {
        Authorization: token,
        ...config.headers,
      };
      return config;
    },
    () => {}
  );

  // 响应拦截
  http.interceptors.response.use(
    (res) => {
      if (res.data.code === 403) { //权限错误
        location.href = '/#/admin/login';
      }
      if (res.data.code === 401) { //token认证错误
        Message.error(res.data.msg);
        location.href = '/#/admin/login';
      }
      return res.data ? res.data : res;
    },
    (error) => {
      console.log('error', error);
      // Message.error(error.msg);
    }
  );

  return http(config);
};
