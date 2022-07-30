<template>
  <div>
    <UploadExcel :onSuccess="onSuccess"></UploadExcel>
  </div>
</template>

<script>
import { importEmployee } from "../../api/employees";
export default {
  methods: {
    async onSuccess({ results }) {
      const userRelations = {
        入职日期: "timeOfEntry",
        手机号: "mobile",
        姓名: "username",
        转正日期: "correctionTime",
        工号: "workNumber",
      };
      //   console.log(args);
      // 处理数据
      const resArr = results.map((item) => {
        const obj = {};
        for (const itemKey in item) {
          // 直接取到excel里面的值进行赋值
          // 如果值是时间，格式错误了
          // 调用格式化时间的方法
          if (
            ["correctionTime", "timeOfEntry"].includes(userRelations[itemKey])
          ) {
            // 值是时间 格式化
            obj[userRelations[itemKey]] = new Date(
              this.formatDate(item[itemKey], "/")
            );
          } else {
            obj[userRelations[itemKey]] = item[itemKey];
          }
        }
        return obj;
      });
      console.log(resArr);
      await importEmployee(resArr);
      this.$message.success("成功了！");
    },
    // 当excel中有日期格式的时候，实际转化的值为一个数字，我们需要一个方法进行转化
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1);
      time.setYear(time.getFullYear() - 70);
      const year = time.getFullYear() + "";
      const month = time.getMonth() + 1 + "";
      const date = time.getDate() - 1 + "";
      if (format && format.length === 1) {
        return year + format + month + format + date;
      }
      return (
        year +
        (month < 10 ? "0" + month : month) +
        (date < 10 ? "0" + date : date)
      );
    },
  },
};
</script>

<style></style>
