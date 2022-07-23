import router from "./router";

import store from "./store";

// 引入进度条插件
import NProgress from 'nprogress'
// 进度条插件
import 'nprogress/nprogress.css'

// 定义一个白名单
const whiteList = ['/404','/login']

// 路由前置守卫
router.beforeEach((to,from,next)=>{
    // 开启进度条
    NProgress.start()
    // 判断是否有token
    // 如果有token，除了登录界面不能登录，其他都可以
    const token = store.getters.token
    if(token){
        // 判断是否去登录页面
        if(to.path === '/login'){
            next('/')   //跳转到首页
        }else {
            next() //直接放行
        }
    }else{
        // 判断是否去白名单界面 /login
        if(whiteList.includes(to.path)){
            next()
        }else {
            // 如果你没有token，同时要去的页面不是白名单页面（要去有全新的页面） --->重定向登录页面
            next('/login')
        }
    }
})

// 后置守卫
router.afterEach(()=>{
    NProgress.done()// 结束进度条
})