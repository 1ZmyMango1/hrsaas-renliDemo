// 引入静态路由表
import { asyncRoutes, constantRoutes } from "@/router";

const state = {
    // 存储了当前用户所拥有的路由权限
    routes:constantRoutes
}

const mutations = {
    // newRouter动态路由
    // 请求到个人信息的时候，动态路由和静态路由进行合并
    setRoutes(state,newRouter){
        state.routes = [...constantRoutes, ...newRouter]
    }
}

const actions = {
    filterRoutes(context,menus){
        // 动态路由  asyncRoutes
        // 用户拥有的路由的name 值
        // 筛选
        const resRoutes = asyncRoutes.filter(item=>{
            return menus.includes(item.name)
        })
        context.commit('setRoutes',resRoutes)
        return resRoutes
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}