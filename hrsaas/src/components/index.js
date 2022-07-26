import ToolBar from "@/components/ToolBar";
import UploadExcel from "@/components/UploadExcel";
import ImageUpload from "@/components/ImageUpload";

export default {
  install(Vue) {
    Vue.component(ToolBar.name, ToolBar); //注册工具栏组件
    Vue.component(UploadExcel.name, UploadExcel); //注册导入excel组件
    Vue.component(ImageUpload.name, ImageUpload); //注册导入图片的组件
  },
};
