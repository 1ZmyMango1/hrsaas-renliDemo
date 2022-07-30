<template>
  <div class="dashboard-container">
    <div class="app-container">
      <ToolBar>
        <template #before>
          <span>共500条数据</span>
        </template>

        <template #after>
          <el-button type="primary" size="mini" @click="$router.push('/import')"
            >导入</el-button
          >
          <el-button type="danger" size="mini" @click="exportExcel"
            >导出</el-button
          >
          <el-button
            type="warning"
            size="mini"
            @click="isShowDialogVisible = true"
            >新增员工
          </el-button>
        </template>
      </ToolBar>

      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="date" label="序号" type="index">
        </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="workNumber" label="工号"> </el-table-column>
        <el-table-column
          :formatter="formatter"
          prop="formOfEmployment"
          label="聘用形式"
        >
        </el-table-column>
        <el-table-column prop="departmentName" label="部门名称">
        </el-table-column>
        <el-table-column label="入职时间">
          <template v-slot="{ row }">
            {{ row.correctionTime | formatDate }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="账户状态">
          <template>
            <el-switch v-model="value" active-color="#13ce66"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="操作">
          <template v-slot="{ row }">
            <el-button type="text" size="small">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small" @click="delBtn(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-row type="flex" justify="center" style="margin-top: 20px">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="page.size"
          :current-page="page.page"
          @current-change="currentChange"
        >
        </el-pagination>
      </el-row>
    </div>
    <AddEmploy :isShowDialogVisible.sync="isShowDialogVisible"></AddEmploy>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from "../../api/employees";
import employees from "../../api/constant/employees";
import AddEmploy from "./components/add-employee.vue";
// import ToolBar from "../../components/ToolBar";
export default {
  components: {
    // ToolBar,
    AddEmploy,
  },
  data() {
    return {
      isShowDialogVisible: false,
      value: false,
      page: {
        page: 1,
        size: 5,
      },
      total: 0,
      tableData: [],
    };
  },
  created() {
    this.getEmployeeList();
  },
  methods: {
    // 获取员工列表数据
    async getEmployeeList() {
      const { rows, total } = await getEmployeeList(this.page);
      // console.log(res);
      this.tableData = rows;
      this.total = total;
    },
    // 分页
    currentChange(page) {
      // console.log(page);
      this.page.page = page;
      this.getEmployeeList();
    },
    // 聘请形式
    formatter(row, column, cellValue) {
      const currentData = employees.hireType.find(
        (item) => item.id === cellValue
      )?.value;
      return currentData || "未知";
    },
    // 删除
    async delBtn(id) {
      try {
        // 提示框
        await this.$confirm("是否删除？");
        // 删除操作
        await delEmployee(id);
        // 提醒
        this.$message.success("删除成功");
        // 重新渲染页面
        await this.getEmployeeList();
      } catch (e) {
        console.log(e);
      }
    },
    async exportExcel() {
      const { export_json_to_excel } = await import("../../utils/Export2Excel");
      const tHeader = ["id", "name"];
      export_json_to_excel({
        header: tHeader, //表头 必填
        data: [
          [1, "易烊千玺"],
          [2, "黎明"],
        ], // 具体数据 必填
        filename: "excel-list", //非必填
        autoWidth: true, //非必填
        bookType: "xlsx", //非必填
      });
    },
  },
};
</script>

<style></style>
