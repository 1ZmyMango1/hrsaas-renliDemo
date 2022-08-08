<template>
  <div>
    <el-upload
      action="https://jsonplaceholder.typicode.com/posts/"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
      :limit="1"
      :file-list="fileList"
      :class="{ disabled: fileComputed }"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress
      style="width: 180px"
      :percentage="percent"
      v-if="isShowPercent"
    />

    <el-dialog :visible.sync="dialogVisible">
      <img width="70%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import COS from "cos-js-sdk-v5";

const cos = new COS({
  SecretId: "AKID4ybx2rOedMoztWtzoMeeNp1waw3sQhgV",
  SecretKey: "bvykFTQt51g39yWmmUv5zcx1oKZWCckb",
});
export default {
  name: "ImageUpload",
  data() {
    return {
      isShowPercent: false, //进度条
      percent: 0,
      dialogImageUrl: "",
      dialogVisible: false,
      fileList: [
        {
          url: "https://img1.baidu.com/it/u=2029513305,2137933177&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=472",
        },
      ],
    };
  },
  computed: {
    // 设定一个计算属性 判断是否已经上传完了一张
    fileComputed() {
      return this.fileList.length === 1;
    },
  },
  methods: {
    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      // console.log(file, fileList)
      // this.fileList = this.fileList.filter(item => item.uid !== file.uid)
      this.fileList = fileList;
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    changeFile(file, fileList) {
      // fileList 上传成功的文件列表
      this.fileList = fileList;
    },
    // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    beforeUpload(file) {
      // 要开始做文件上传的检查了
      // 文件类型 文件大小
      const types = ["image/jpeg", "image/gif", "image/bmp", "image/png"];
      if (!types.includes(file.type)) {
        this.$message.error("上传图片只能是 JPG、GIF、BMP、PNG 格式!");
        return false;
      }
      //  检查大小
      const maxSize = 5 * 1024 * 1024; // 1M=1024KB 1KB = 1024B
      if (maxSize < file.size) {
        this.$message.error("图片大小最大不能超过5M");
        return false;
      }
      this.isShowPercent = true;
      return true;
    },
    // 覆盖默认的上传行为，可以自定义上传的实现
    // 进行上传操作
    upload(params) {
      //   console.log(params.file)
      if (params.file) {
        // 执行上传操作
        cos.putObject(
          {
            Bucket: "zmy-1313213567", // 存储桶
            Region: "ap-nanjing", // 地域
            Key: params.file.name, // 文件名
            Body: params.file, // 要上传的文件对象
            StorageClass: "STANDARD", // 上传的模式类型 直接默认 标准模式即可
            onProgress: (params) => {
              this.percent = params.percent * 100;
            },
            // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
          },
          (err, data) => {
            // data返回数据之后 应该如何处理
            console.log(err || data);
            if (err) {
              return this.$message.error(err?.message || "上传失败");
            }
            this.fileList.forEach((item) => {
              if (item.uid === params.file.uid) {
                item.url = `https://${data.Location}`;
                item.upload = true;
              }
            });
            setTimeout(() => {
              this.isShowPercent = false;
              this.percent = 0;
            }, 1000);
          }
        );
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.disabled {
  ::v-deep .el-upload--picture-card {
    display: none;
  }
}
</style>
