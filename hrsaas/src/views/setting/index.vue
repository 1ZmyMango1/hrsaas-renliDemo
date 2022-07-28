<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="用户管理" name="first">
          <el-button
            icon="el-icon-plus"
            type="primary"
            size="small"
            @click="dialogVisible = true"
            >新增角色</el-button
          >

          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="date" label="序号" width="180" type="index">
            </el-table-column>
            <el-table-column prop="name" label="角色名称" width="180">
            </el-table-column>
            <el-table-column prop="description" label="描述"> </el-table-column>
            <el-table-column label="操作">
              <template v-slot="{ row }">
                <el-button type="success" size="small">分配权限</el-button>
                <el-button type="primary" size="small" @click="edit(row.id)"
                  >编辑</el-button
                >
                <el-button type="danger" size="small" @click="delBtn(row.id)"
                  >删除</el-button
                >
              </template>
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
    <el-dialog :title="title" :visible="dialogVisible" @close="close">
      <el-form
        ref="roleForm"
        :model="roleFormData"
        :rules="roleRules"
        label-width="120px"
      >
        <el-form-item label="角色" prop="name">
          <el-input v-model="roleFormData.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="roleFormData.description"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submitOk">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleList,
  getCompanyInfo,
  deleteRole,
  getRoleDetail,
  updateRole,
  addRole,
} from "../../api/setting";
export default {
  data() {
    return {
      activeName: "first",
      tableData: [],
      page: {
        page: 1,
        pagesize: 10,
        total: 0,
      },
      fromData: {},
      dialogVisible: false,
      roleFormData: {
        name: "",
        description: "",
      },
      roleRules: {
        name: [
          {
            required: true,
            message: "角色必填项",
          },
        ],
      },
    };
  },
  created() {
    this.getRoleList();
    this.getCompanyInfo();
  },
  computed: {
    title() {
      return this.roleFormData?.id ? "编辑" : "新增";
    },
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
    // 删除
    async delBtn(id) {
      try {
        // 通过插槽获取的id 来确定那一条数据
        await this.$confirm("确定删除吗？");
        // 获取当前界面删除之前的数据长度
        const len = this.tableData.length;
        // 如果删除之前的数据长度为1，同时当前页码数不是第一页的情况下 页码自减一
        if (len === 1 && this.page.page > 1) {
          this.page--;
        }
        // 删除
        await deleteRole(id);
        // 成功提示
        this.$message.success("删除成功");
        // 重新渲染页面
        this.getRoleList();
      } catch (e) {
        console.log(e);
      }
    },
    // 编辑
    async edit(id) {
      // 弹层显示
      this.dialogVisible = true;
      // 调用接口 通过插槽row传过来的id 实现数据回显
      this.roleFormData = await getRoleDetail(id);
    },
    // 取消
    close() {
      this.dialogVisible = false;
      // 清空表单效验
      this.$refs.roleForm.resetFields();
      // 把表单数据置空
      this.roleFormData = {
        name: "",
        description: "",
      };
    },
    // 确定
    async submitOk() {
      // 先进行表单效验
      this.$refs.roleForm.validate();
      // 判断是否是编辑 或者新增 进行提交表单
      if (this.roleFormData.id) {
        await updateRole(this.roleFormData);
      } else {
        await addRole(this.roleFormData);
      }
      this.$message.success("成功");
      this.getRoleList();
      this.close();
    },

    handleClick() {},
  },
};
</script>

<style></style>
