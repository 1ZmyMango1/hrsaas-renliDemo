<template>
  <!-- 用了一个行列布局 -->
  <el-row type="flex" style="width: 100%" justify="space-between">
    <el-col>
      <span>{{ treeData.name }}</span>
    </el-col>
    <el-col :span="8">
      <el-row type="flex" justify="space-between">
        <!-- 两个内容 -->
        <el-col>{{ treeData.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <el-dropdown @command="clickItem" style="margin-left: 10px">
            <span> 操作<i class="el-icon-arrow-down" /> </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit"
                >编辑部门</el-dropdown-item
              >
              <el-dropdown-item v-if="!isRoot" command="delete"
                >删除部门</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from "../../../api/departments";
export default {
  name: "TreeTool",
  props: {
    treeData: {
      type: Object,
      default: () => ({}),
    },
    isRoot: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    async clickItem(type) {
      // 判断的点击的按钮状态
      if (type === "add") {
        // 添加逻辑
        // 通过自定义事件 通知父亲开启弹层
        this.$emit("handlerAddDept", this.treeData); // 告诉父组件 显示弹层
        console.log("点击了添加");
      } else if (type === "edit") {
        // 编辑逻辑
        // 通过自定义事件 通知父亲开启弹层
        this.$emit("handlerEditDept", this.treeData);
        console.log("点击了编辑");
      } else {
        try {
          // 删除逻辑
          await this.$confirm("确定退出？");
          console.log("点击了删除");
          // 删除
          await delDepartments(this.treeData.id);
          // 提醒
          this.$message.success("删除成功");
          // 调用父亲接口 重新渲染页面
          this.$emit("getDepartments");
        } catch (e) {
          console.log(e);
        }
      }
    },
  },
};
</script>

<style></style>
