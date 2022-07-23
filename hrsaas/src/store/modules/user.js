import { getToken, setToken, removeToken } from "@/utils/auth";

import { login } from "@/api/user";

// 状态
const state = {
  token: getToken(),
};
// 修改状态
const mutations = {
  // 修改token的方法
  setToken(state, token) {
    state.token = token; //修改了vuex的状态
    setToken(token); //本地存储的设置token的方法 --- 从auth.js引入
  },
  // 移除token
  removeToken(state) {
    state.token = null;
    removeToken();
  },
};
// 执行异步
const actions = {
  // 登录请求
  async login(context, data) {
    console.log(222);
    // 调用登录的请求接口
    const res = await login(data);
    // 打印接口调用的结果
    console.log(res);
    context.commit("setToken", res);
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
