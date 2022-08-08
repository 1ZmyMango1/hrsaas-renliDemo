import axios from "axios";
import { Message } from "element-ui";
import store from "@/store";
import { getTimer } from "../utils/auth";
import router from "@/router";

// token过期的时间
const timerOut = 6000000;
// 如果没有过期返回true
// 如果过期了返回false
function isCheckTime() {
  // console.log(Date.now());
  // console.log(getTimer());
  return Date.now() - getTimer() < timerOut;
}

// 创建一个axios的实例
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 设置axios请求的基础的基础地址
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 如果token存在，请求的时候需要把token携带到请求头上
    const token = store.getters.token;
    if (token) {
      // token 携带到请求头上
      if (isCheckTime()) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // 提示 清空token 清空信息 跳转
        Message.error("登录超时，请重新登录");
        store.dispatch("user/logOut");
        router.push("/");
        return Promise.reject("");
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // console.log(response);
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
  },
  (error) => {
    if (error.response.status === 401) {
      // debugger
      // 退出登录
      store.dispatch("user/logOut");
      router.push("/login");
    }
    Message.error(error.response?.data?.message || "系统错误，请重试");
    return Promise.reject(error);
  }
);

export default request;
