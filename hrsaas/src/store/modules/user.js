// 状态
import { getToken, removeToken, setToken, setTimer } from "@/utils/auth";
import { getUserDetailById, getUserInfo, login } from "@/api/user";

const state = {
  token: getToken(),
  userInfo: {},
};
// 修改状态
const mutations = {
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo;
  },
  //   修改token
  setToken(state, token) {
    state.token = token; //修改了vuex的状态
    setToken(token); //本地存储的设置token的方法 --- 从auth.js引入
  },
  removeToken(state) {
    state.token = null;
    removeToken();
  },
  removeUserInfo(state) {
    state.userInfo = {};
  },
};
// 执行异步
const actions = {
  //  发登录请求 并调用 commit
  async login(context, data) {
    // 调用登录的请求接口
    const res = await login(data);
    setTimer();
    // 打印接口调用的结果
    console.log("res", res);
    context.commit("setToken", res);
  },
  //  获取用户资料
  async getUserInfo(context) {
    const data = await getUserInfo(); //获取返回值
    const baseInfo = await getUserDetailById(data.userId);
    context.commit("setUserInfo", { ...data, ...baseInfo });
  },

  // 退出登录
  logOut(context) {
    context.commit("removeToken");
    context.commit("removeUserInfo");
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
