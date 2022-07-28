<template>
  <div class="dashboard-container">
    <div class="app-container">
      <TooBar>
        <template #before>
          <span>共500条数据</span>
        </template>

        <template #after>
          <el-button type="primary" size="mini">导入</el-button>
          <el-button type="danger" size="mini">导出</el-button>
          <el-button type="warning" size="mini">新增员工  </el-button>
        </template>
      </TooBar>
    </div>
  </div>
</template>

<script>
import TooBar from "../../components/TooBar";
export default {
  components: {
    TooBar,
  },
};
</script>

<style></style>
