<template>
  <div>
    <el-dialog
      :title="`${showTitle}部门`"
      :visible="isShowAddDept"
      width="30%"
      @close="close"
    >
      <el-form ref="form" label-width="100px" :model="formData" :rules="rules">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="formData.code"></el-input>
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <!-- <el-input v-model="formData.manager"></el-input> -->
          <el-select
            v-model="formData.manager"
            placeholder="请选择"
            @focus="getEmployeeSimple"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.username"
              :value="item.username"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input v-model="formData.introduce" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close">取 消</el-button>
          <el-button type="primary" @click="submitAdd">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDepartments,
  addDepartments,
  getDepartDetail,
  updateDepartments,
} from "../../../api/departments";
import { getEmployeeSimple } from "../../../api/employees";
export default {
  name: "AddDept",
  props: {
    isShowAddDept: {
      type: Boolean,
      default: false,
    },
    currentNode: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    const checkName = async (rule, value) => {
      // 1:获取所有部门数据
      const { depts } = await getDepartments();
      // 2:找出当前点击部门的子部门数据有什么特点  pid = 当前点击部门的id
      let currentChildren = null;

      if (this.formData.id) {
        // 编辑
        currentChildren = depts.filter((item) => {
          return (
            // 判断当前用户添写的code是否包含在已存在的数据里面 自己过滤掉自己
            item.pid === this.currentNode.pid && item.id !== this.currentNode.id
          );
        });
      } else {
        // 添加
        currentChildren = depts.filter((item) => {
          return item.pid === this.currentNode.id;
        });
      }

      //3:value值是否和筛选出来的数据结果里面的那么值有重复
      const isRepeat = currentChildren.some((item) => {
        return item.name === value;
      });
      //return promise 也可以让表单验证拿到结果
      //成功的promise -- 成功
      //失败的promise -- 失败
      if (isRepeat) {
        return Promise.reject("部门名称重复了！");
      }
    };
    const checkCode = async (rule, value) => {
      // 获取所有部门数据
      const { depts } = await getDepartments();
      // 判断所有部门里面的code 和 输入的 内容是否 重复
      let reRepeat = null;
      if (this.formData.id) {
        // 编辑
        reRepeat = depts.some(
          (item) => item.code === value && item.id !== this.currentNode.id
        );
      } else {
        // 新增
        reRepeat = depts.some((item) => item.code === value);
      }

      // 如果重复 提醒用户 说明表单验证失败
      if (reRepeat) {
        return Promise.reject("部门编码重复了");
      }
    };
    return {
      dialogVisible: false,
      options: [],
      formData: {
        name: "",
        code: "",
        manager: "",
        introduce: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "部门名称不能为空",
          },
          {
            min: 1,
            max: 50,
            message: "部门名称1-50个字符",
          },
          {
            // 自定义函数的形式校验
            validator: checkName,
            trigger: true,
          },
        ],
        code: [
          {
            required: true,
            message: "部门编码不能为空",
          },
          {
            min: 1,
            max: 50,
            message: "部门编码1-50个字符",
          },
          {
            // 自定义函数的形式校验
            validator: checkCode,
            trigger: true,
          },
        ],
        manager: [
          {
            required: true,
            message: "部门负责人不能为空",
          },
        ],
        introduce: [
          {
            required: true,
            message: "部门介绍不能为空",
          },
          {
            min: 1,
            max: 300,
            message: "部门介绍1-300个字符",
          },
        ],
      },
    };
  },
  computed: {
    showTitle() {
      return this.formData.id ? "编辑" : "添加";
    },
  },
  methods: {
    async getEmployeeSimple() {
      this.options = await getEmployeeSimple();
      //   console.log(res);
    },
    async getDepartDetail(id) {
      // 需要获取详情数据的部门id
      this.formData = await getDepartDetail(id);
    },
    async submitAdd() {
      try {
        // 表单验证
        await this.$refs.form.validate();
        if (this.formData.id) {
          // 编辑
          await updateDepartments(this.formData);
        } else {
          //添加
          await addDepartments({
            ...this.formData, //把表单数据展开
            pid: this.currentNode.id,
          });
        }
        this.$message.success(`${this.showTitle}成功`);
        // 通知父组件重新渲染列表
        this.$emit("getDepartments");
        // 调用close
        this.close();
      } catch (e) {
        console.log(e);
      }
    },
    close() {
      //通过sync 方法关闭弹层
      this.$emit("update:isShowAddDept", false);

      //清空form表单数据
      this.$refs.form.resetFields();
      this.formData = {
        name: "",
        code: "",
        manager: "",
        introduce: "",
      };
    },
  },
};
</script>

<style></style>
