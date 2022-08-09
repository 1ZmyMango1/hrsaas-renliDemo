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
        <el-table-column label="头像">
          <template v-slot="{ row }">
            <el-row type="flex" justify="center">
              <el-avatar
                :src="row.staffPhoto"
                style="width: 80px; height: 80px"
                @click.native="showQrCode(row.staffPhoto)"
              >
                <img src="../../assets/common/leftnavBg.png" alt="" />
              </el-avatar>
            </el-row>
          </template>
        </el-table-column>
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
            <el-button
              type="text"
              size="small"
              @click="$router.push(`/employees/detail/${row.id}`)"
              >查看</el-button
            >
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small" @click="isShowRole(row.id)"
              >角色</el-button
            >
            <el-button
              :disabled="checkPermission('DELETE_USER')"
              type="text"
              size="small"
              @click="delBtn(row.id)"
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

    <el-dialog
      title="二维码"
      :visible.sync="showCodeDialog"
      @opened="showQrCode"
      @close="imgUrl = ''"
    >
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>

    <AssDialog
      :userId="userId"
      ref="roleRef"
      :showDialog.sync="showDialog"
    ></AssDialog>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from "../../api/employees";
import employees from "../../api/constant/employees";
import AddEmploy from "./components/add-employee.vue";
import { formatDate } from "../../filters/index";
// import ToolBar from "../../components/ToolBar";
import QrCode from "qrcode";
import AssDialog from "./components/assign-role.vue";
import { mixins } from "../../utils/mixins";
// import { getUserDetailById } from "@/api/user";
export default {
  mixins: [mixins],
  components: {
    // ToolBar,
    AddEmploy,
    AssDialog,
  },
  data() {
    return {
      showDialog: false,
      showCodeDialog: false,
      isShowDialogVisible: false,
      value: false,
      page: {
        page: 1,
        size: 5,
      },
      total: 0,
      tableData: [],
      userId: null,
    };
  },
  created() {
    this.getEmployeeList();
  },
  methods: {
    // 角色弹窗
    async isShowRole(id) {
      this.userId = id;
      await this.$refs.roleRef.getUserDetailById(id);
      this.showDialog = true;
    },
    showQrCode(url) {
      // 预览头像展示出来
      this.showCodeDialog = true;
      // 数据更新之后界面不能立即更新
      // 如果要在数据更新后获取到更新后的最新dom元素
      // 需要使用$nextTick
      this.$nextTick(() => {
        QrCode.toCanvas(this.$refs.myCanvas, url);
      });
    },
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
      const headers = {
        手机号: "mobile",
        姓名: "username",
        入职日期: "timeOfEntry",
        聘用形式: "formOfEmployment",
        转正日期: "correctionTime",
        工号: "workNumber",
        部门: "departmentName",
      };
      const { rows } = await getEmployeeList({
        page: 1,
        size: this.page.total,
      });
      const data = this.formatJson(headers, rows);
      const { export_json_to_excel } = await import("../../utils/Export2Excel");
      const tHeader = ["id", "name"];
      export_json_to_excel({
        header: Object.keys(headers), //表头 必填
        data: data, // 具体数据 必填
        filename: "excel-list", //非必填
        autoWidth: true, //非必填
        bookType: "xlsx", //非必填
      });
    },
    formatJson(headers, rows) {
      return rows.map((item) => {
        return Object.keys(headers).map((key) => {
          // 判断
          // 如果是时间 -- 格式化
          // 如果是聘用形式 -- 转化 1 正式员工 2 非正式员工 未知
          if (["timeOfEntry", "correctionTime"].includes(headers[key])) {
            return formatDate(item[headers[key]]);
          }
          if (headers[key] === "formOfEmployment") {
            return (
              EmployeeEnum.hireType.find(
                (child) => +child.id === +item[headers[key]]
              )?.value || "未知"
            );
          }
          return item[headers[key]];
        });
      });
    },
  },
};
</script>

<style></style>
