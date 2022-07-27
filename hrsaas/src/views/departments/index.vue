<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <TreeTool
          :is-root="true"
          :tree-data="company"
          @handlerAddDept="handlerAddDept"
        ></TreeTool>
      </el-card>

      <el-tree :data="departs" :props="defaultProps" default-expand-all>
        <template v-slot="{ data }">
          <TreeTool
            :is-root="false"
            :tree-data="data"
            @getDepartments="getDepartments"
            @handlerAddDept="handlerAddDept"
            @handlerEditDept="handlerEditDept"
          ></TreeTool>
        </template>
      </el-tree>
    </div>
    <AddDept
      :isShowAddDept.sync="isShowAddDept"
      :currentNode="currentNode"
      @getDepartments="getDepartments"
      ref="addDept"
    ></AddDept>
  </div>
</template>

<script>
import TreeTool from "./compoents/tree-tool.vue";
import { getDepartments } from "../../api/departments";
import { transListToTree } from "../../utils/index";
import AddDept from "./compoents/add-dept.vue";
export default {
  components: {
    TreeTool,
    AddDept,
  },
  data() {
    return {
      isShowAddDept: false, //控制子组件的弹层
      currentNode: {},
      defaultProps: {
        children: "children",
        label: "name",
      },
      departs: [
        {
          name: "总裁办",
          manager: "曹操",
          children: [{ name: "董事会", manager: "曹丕" }],
        },
        { name: "行政部", manager: "刘备" },
        { name: "人事部", manager: "孙权" },
      ],
      company: { name: "江苏传智播客教育科技股份有限公司", manager: "负责人" },
    };
  },
  created() {
    this.getDepartments();
  },
  methods: {
    // 树形结构的接口内容
    async getDepartments() {
      const res = await getDepartments();
      // console.log(res, "res");
      // 替换公司数据
      this.company = {
        name: res.companyName,
        manager: res.companyManager || "管理员",
        id: "",
      };
      // 替换部门数据
      this.departs = transListToTree(res.depts, "");
    },
    // 添加
    handlerAddDept(node) {
      // addDept显示弹层
      this.isShowAddDept = true;
      //子组件传给父组件的当前哪一项数据
      this.currentNode = node;
    },
    // 编辑
    handlerEditDept(node) {
      // 弹层显示
      this.isShowAddDept = true;
      // 记录当前节点
      this.currentNode = node;
      // 父组件 调用子组件的方法
      this.$refs.addDept.getDepartDetail(node.id); // 直接调用子组件中的方法 传入一个id
    },
  },
};
</script>

<style scoped>
.app-container {
  width: 850px;
  border: 1px solid red;
  margin: 50px auto;
}

.box-card {
  background-color: #99ccff;
}
</style>
