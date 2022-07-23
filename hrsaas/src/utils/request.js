import axios from "axios";
import { Message } from "element-ui";

// 创建一个axios的实例
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 设置axios请求的基础的基础地址
});

// 请求拦截器
request.interceptors.request.use();

// 响应拦截器
request.interceptors.response.use((response) => {
  console.log(response);
  const {
    data: { success, data, message },
  } = response;
  //判断 success是否为true
  // true --- 请求成功 data可用的
  if (success) {
    return data;
  }
  // 如果代码走到这里，证明success是false 失败
  // 进行错误提示
  Message.error(message || "出错啦~");

  // 失败的promise  --接口请求有问题
  return Promise.reject(message || "出错啦");
});

export default request;
