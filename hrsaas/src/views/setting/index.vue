<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="用户管理" name="first">
          <el-button icon="el-icon-plus" type="primary" size="small"
            >新增角色</el-button
          >

          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="date" label="序号" width="180" type="index">
            </el-table-column>
            <el-table-column prop="name" label="角色名称" width="180">
            </el-table-column>
            <el-table-column prop="description" label="描述"> </el-table-column>
            <el-table-column label="操作">
              <el-button type="success" size="small">分配权限</el-button>
              <el-button type="primary" size="small">编辑</el-button>
              <el-button type="danger" size="small">删除</el-button>
            </el-table-column>
          </el-table>

          <el-row type="flex" justify="center" style="margin-top: 20px">
            <el-pagination
              :page-size="page.pagesize"
              :current-page="page.page"
              layout="prev, pager, next"
              :total="page.total"
              @current-change="currentPage"
            >
            </el-pagination>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="公司信息" name="second">
          <el-alert title="消息提示的文案" type="info" show-icon> </el-alert>

          <el-form
            ref="form"
            label-width="80px"
            disabled
            style="margin-top: 20px"
          >
            <el-form-item label="公司名称">
              <el-input v-model="fromData.name" style="width: 50%"></el-input>
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input
                v-model="fromData.companyAddress"
                style="width: 50%"
              ></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input
                v-model="fromData.mailbox"
                style="width: 50%"
              ></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                v-model="fromData.remarks"
                style="width: 50%"
                type="textarea"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { getRoleList, getCompanyInfo } from "../../api/setting";
export default {
  data() {
    return {
      activeName: "first",
      tableData: [],
      page: {
        page: 1,
        pagesize: 2,
        total: 0,
      },
      fromData: {},
    };
  },
  created() {
    this.getRoleList();
    this.getCompanyInfo();
  },
  methods: {
    // 角色列表数据
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page);
      // console.log(res, "res");
      this.tableData = rows;
      this.page.total = total;
      // console.log(this.tableData);
    },
    currentPage(page) {
      // console.log(page, "page");
      // 切换之后的最新页码
      this.page.page = page;
      this.getRoleList();
    },
    // 公司信息
    async getCompanyInfo() {
      this.fromData = await getCompanyInfo(this.$store.getters.companyId);
      // console.log(this.fromData);
    },

    handleClick() {},
  },
};
</script>

<style></style>
