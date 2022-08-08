<template>
  <div>
    <el-card class="card">
      <el-tabs>
        <el-tab-pane label="登录账户设置">
          <el-form
            ref="form"
            :model="formData"
            :rules="rules"
            label-width="80px"
            class="form"
          >
            <el-form-item label="姓名" prop="username">
              <el-input
                v-model="formData.username"
                style="width: 40%"
              ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password2">
              <el-input
                v-model="formData.password2"
                style="width: 40%"
              ></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submit">更新</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="个人详情">
          <component :is="UserInfo"></component>
        </el-tab-pane>
        <el-tab-pane label="岗位信息">
          <component :is="JobInfo"></component>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getUserDetailById, saveUserDetailById } from "../../../api/employees";
import UserInfo from "./user-info.vue";
import JobInfo from "./job-info.vue";
export default {
  components: { UserInfo, JobInfo },
  data() {
    return {
      UserInfo: "UserInfo",
      JobInfo: "JobInfo",
      formData: {
        username: "",
        password2: "",
      },
      rules: {
        username: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
        ],
        password2: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 9, message: "密码长度6-9位", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getUserDetailById();
  },
  methods: {
    // 获取某个用户的基本信息
    async getUserDetailById() {
      const res = await getUserDetailById(this.$route.params.id);
      this.formData = res;
    },
    async submit() {
      this.$refs.form.validate();
      try {
        await saveUserDetailById({
          ...this.formData,
          password: this.formData.password2,
        });
        await this.$message.success("更新成功");
      } catch (e) {
        // console.log(e);
        this.$message.error(e.message || "更新失败");
      }
    },
  },
};
</script>

<style>
.card {
  margin: 20px;
}
.form {
  margin-top: 30px;
}
</style>
