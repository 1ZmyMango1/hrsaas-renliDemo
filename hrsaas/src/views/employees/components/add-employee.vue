<template>
  <div>
    <el-dialog
      title="新增员工"
      :visible="isShowDialogVisible"
      width="30%"
      @close="close"
    >
      <el-form
        ref="formRef"
        label-width="120px"
        :model="formData"
        :rules="rules"
      >
        <el-form-item label="姓名" prop="username">
          <el-input
            style="width: 80%"
            placeholder="请输入姓名"
            v-model="formData.username"
          />
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input
            style="width: 80%"
            placeholder="请输入手机号"
            v-model="formData.mobile"
          />
        </el-form-item>
        <el-form-item label="入职时间" prop="timeOfEntry">
          <el-date-picker
            style="width: 80%"
            placeholder="请选择入职时间"
            v-model="formData.timeOfEntry"
          />
        </el-form-item>
        <el-form-item label="聘用形式" prop="formOfEmployment">
          <el-select
            style="width: 80%"
            placeholder="请选择"
            v-model="formData.formOfEmployment"
          >
            <el-option
              v-for="item in EmployeeEnum.hireType"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工号" prop="workNumber">
          <el-input
            style="width: 80%"
            placeholder="请输入工号"
            v-model="formData.workNumber"
          />
        </el-form-item>
        <el-form-item label="部门" prop="departmentName">
          <!-- <el-input
            style="width: 80%"
            placeholder="请选择部门"
            v-model="formData.departmentName"
          /> -->
          <template>
            <el-cascader
              v-model="formData.departmentName"
              :options="options"
              :props="{
                label: 'name',
                value: 'name',
                emitPath: false,
                checkStrictly: true,
              }"
              clearable
            ></el-cascader>
          </template>
        </el-form-item>
        <el-form-item label="转正时间" prop="correctionTime">
          <el-date-picker
            style="width: 80%"
            placeholder="请选择转正时间"
            v-model="formData.correctionTime"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="isOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDepartments } from "../../../api/departments";
import { transListToTreeNew } from "../../../utils/index";
import EmployeeEnum from "../../../api/constant/employees";
import { addEmployee } from "../../../api/employees";
export default {
  name: "AddEmploy",
  props: {
    isShowDialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      EmployeeEnum,
      formData: {
        username: "", // 用户姓名
        mobile: "", // 手机号
        timeOfEntry: "", // 入职时间
        formOfEmployment: "", // 聘用形式
        workNumber: "", // 工号
        departmentName: "", // 部门名称
        correctionTime: "", // 转正时间
      },
      rules: {
        username: [
          { required: true, message: "用户姓名不能为空", trigger: "blur" },
          {
            min: 1,
            max: 4,
            message: "用户姓名为1-4位",
          },
        ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
        formOfEmployment: [
          { required: true, message: "聘用形式不能为空", trigger: "blur" },
        ],
        workNumber: [
          { required: true, message: "工号不能为空", trigger: "blur" },
        ],
        departmentName: [
          { required: true, message: "部门不能为空", trigger: "change" },
        ],
        timeOfEntry: [{ required: true, message: "入职时间", trigger: "blur" }],
      },
      options: [],
    };
  },
  created() {
    this.getDepartments();
  },
  methods: {
    // 获取部门数据列表
    async getDepartments() {
      const { depts } = await getDepartments();
      //   console.log(res);
      this.options = transListToTreeNew(depts, "");
    },

    // 确认
    async isOk() {
      try {
        // 表单验证
        this.$refs.formRef.validate();
        //   添加
        await addEmployee(this.formData);
        //   添加成功提示
        this.$message.success("添加成功");
        this.close();
        this.$parent.getEmployeeList();
      } catch (e) {
        console.log(111);
        console.log(e);
      }
    },

    // 取消
    close() {
      this.$emit("update:isShowDialogVisible", false);
      //重置效验规则
      this.$refs.formData.resetFields();
      //清空表单数据
      this.formData = {
        username: "",
        mobile: "",
        formOfEmployment: "",
        workNumber: "",
        departmentName: "",
        timeOfEntry: "",
        correctionTime: "",
      };
    },
  },
};
</script>

<style></style>
