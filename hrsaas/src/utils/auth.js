import Cookies from 'js-cookie'

const TokenKey = 'hrsaas_token'   //toekn 存储到本地存储 >>key

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
