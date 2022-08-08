<template>
  <el-dialog title="分配角色" :visible="showDialog" @close="close">
    <!-- 分配角色 -->
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="12">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="close">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from "@/api/setting";
import { getUserDetailById } from "@/api/user";
import { assignRoles } from "@/api/employees";

export default {
  name: "AssignRole",
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      roleIds: [],
      list: [],
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async btnOK() {
      try {
        await assignRoles({ id: this.userId, roleIds: this.roleIds });
        this.$message.success("分配角色成功");
        // 关闭弹窗
        this.close();
      } catch (e) {
        this.$message.error(e?.message || "分配角色失败");
        this.close();
      }
    },
    close() {
      this.roleIds = [];
      this.$emit("update:showDialog", false);
    },
    //  获取所有角色
    async getRoleList() {
      const { rows } = await getRoleList();
      this.list = rows;
    },
    // 按 ID 获取用户详细信息
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id);
      this.roleIds = roleIds || []; // 赋值本用户的角色
    },
  },
};
</script>
