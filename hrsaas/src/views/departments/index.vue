<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <TreeTool :is-root="true" :tree-data="company"></TreeTool>
      </el-card>

      <el-tree :data="departs" :props="defaultProps" default-expand-all>
        <template v-slot="{ data }">
          <TreeTool :is-root="false" :tree-data="data"></TreeTool>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<script>
import TreeTool from "./compoents/tree-tool.vue";
import { getDepartments } from "../../api/departments";
import { transListToTree } from "../../utils/index";
export default {
  components: {
    TreeTool,
  },
  data() {
    return {
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
      };
      // 替换部门数据
      this.departs = transListToTree(res.depts, "");
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
