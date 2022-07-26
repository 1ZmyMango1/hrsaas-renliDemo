import Vue from "vue";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Print  from 'vue-print-nb'
// import locale from "element-ui/lib/locale/lang/en"; // lang i18n
import Components from "./components/index";//全局注册 插槽
Vue.use(Components)

Vue.use(Print)

import "@/styles/index.scss"; // global css

import App from "./App";
import store from "./store";
import router from "./router";

import "@/icons"; // icon
import "@/permission"; // permission control

// 一次性注册所有指令
import * as directives from "@/directives/index";

for (const key in directives) {
  // 注册指令
  Vue.directive(key, directives[key]);
}

// 引入过滤器 --注册
import * as filters from '@/filters/index'
// 所有的过滤器，进行全局注册
for(const filtersKey in filters){
  Vue.filter(filtersKey, filters[filtersKey])
}

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale });
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});
