<template>
  <div class="dashboard-container">
    <div class="app-container">
      <ToolBar>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addPermission('0', 1)"
            >添加权限</el-button
          >
        </template>
      </ToolBar>

      <!-- 表格 -->
      <el-table row-key="id" :data="list" border>
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template v-slot="{ row }">
            <el-button
              v-if="row.type === 1"
              type="text"
              @click="addPermission(row.id, 2)"
              >添加</el-button
            >
            <el-button type="text">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="提示" :visible.sync="showDialog" width="50%">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="form.code"></el-input>
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="是否开启">
          <el-switch
            v-model="value"
            active-color="#008000"
            inactive-color="#ff4949"
          >
          </el-switch>
        </el-form-item>

        <el-row type="flex" justify="end">
          <el-form-item>
            <template>
              <el-button>取消</el-button>
              <el-button type="primary" @click="onSubmit">确定</el-button>
            </template>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPermissionList,
  addPermission,
  delPermission,
} from "../../api/permisson";
import { transListToTree } from "../../utils";
export default {
  data() {
    return {
      showDialog: false,
      list: [],
      form: {
        name: "", // 名称
        code: "", // 标识
        description: "", // 描述
        type: "", // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: "", // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: "0", // 开启
      },
      rules: {
        name: [
          { required: true, message: "权限名称不能为空", trigger: "blur" },
        ],
        code: [
          { required: true, message: "权限标识不能为空", trigger: "blur" },
        ],
      },
      value: "",
    };
  },
  created() {
    this.getPermissionList();
  },
  methods: {
    // 获取权限/初始化的时候获取所有的权限列表
    async getPermissionList() {
      const res = await getPermissionList();
      // console.log(res);
      this.list = transListToTree(res, "0");
    },
    // 添加权限
    addPermission(pid, type) {
      // pid和type 是点击传过来的
      this.form.pid = pid;
      this.form.type = type;
      this.showDialog = true;
    },
    // 确认按钮
    async onSubmit() {
      try {
        //表单验证
        this.$refs.formRef.validate();
        // 判断是添加还是编辑
        if (this.form.id) {
          // 编辑
        } else {
          // 新增
          await addPermission(this.form);
        }
        this.$message.success("成功");
        // 重新渲染数据
        await this.getPermissionList();
        this.close();
      } catch (e) {
        console.log(e);
      }
    },
    // 取消
    close() {
      this.$refs.formRef.resetFields();
      this.form = {
        name: "", // 名称
        code: "", // 标识
        description: "", // 描述
        type: "", // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: "", // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: "0", // 开启
      };
      this.showDialog = false;
    },
    // 删除
    async delPermission(id) {
      await this.$confirm("确定删除吗?");
      // 删除
      await delPermission(id);
      this.$message.success("删除成功");
      // 重新渲染页面
      await this.getPermissionList();
    },
  },
};
</script>

<style></style>
