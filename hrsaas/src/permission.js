import router from "@/router";
import store from "@/store";
// 引入进度条插件
import Nprogress from "nprogress";
import "nprogress/nprogress.css";

const loginPath = "/login";
const notFoundPath = "/404";

// 定义一个白名单
const whiteList = [loginPath, notFoundPath];

// 路由前置守卫
router.beforeEach(async (to, from, next) => {
  // 开启进度条
  Nprogress.start();
  // 判断有没有token
  if (store.getters.token) {
    // 有token 并且没有用户信息时 去请求用户信息
    if (!store.getters.userId) {
      // 获取用户信息
      const res = await store.dispatch("user/getUserInfo");
      console.log(res);
      // 添加用户拥有的路由权限之后，在去做跳转， filterRoutes
      const routes = await store.dispatch(
        "permission/filterRoutes",
        res.roles.menus
      );
      // 默认情况只有静态路由
      //进行动态路由的添加
      router.addRoutes([
        ...routes,
        { path: "*", redirect: "/404", hidden: true },
      ]); // 404 page must be placed at the end !!!
      // 重新进行跳转
      next(to.path);
    }
    // 有token 如果去登陆页面 直接跳转到首页
    if (to.path === loginPath) {
      return next("/");
    } else {
      // 不去登录页面 直接放行
      return next();
    }
  } else {
    // 没有token
    // 如果在白名单内 直接放行
    if (whiteList.includes(to.path)) {
      return next();
    } else {
      // 不在白名单 就去登陆页面
      return next(loginPath);
    }
  }
});
// 后置守卫
router.afterEach(() => {
  Nprogress.done(); // 结束进度条
});
