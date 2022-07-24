import Cookies from "js-cookie";

const TokenKey = "hrsaas_token"; //toekn 存储到本地存储 >>key

const timerKey = "timer_key";

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

// 获取时间戳
export function getTimer() {
  return Cookies.get(timerKey);
}

// 设置时间戳
export function setTimer() {
  Cookies.set(timerKey, Date.now());
}
