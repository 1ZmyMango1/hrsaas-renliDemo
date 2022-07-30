import ToolBar from '@/components/ToolBar'
import UploadExcel  from '@/components/UploadExcel'

export default{
    install(Vue){
        Vue.component(ToolBar.name,ToolBar) //注册工具栏组件
        Vue.component(UploadExcel.name,UploadExcel)//注册导入excel组件
    }
}