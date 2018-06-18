<template>
  <Form :model="formItem" 
    ref="formItem"
    :label-width="80"
    :rules="ruleValidate"
    class="my-form">
    <FormItem label="项目名称" prop="name">
      <Input v-model="formItem.name" placeholder="请输入项目名称"></Input>
    </FormItem>
    <FormItem label="项目类别" prop="type">
      <Select v-model="formItem.type">
        <Option v-for="(item, index) in message" :value="item" :key="index + 200">{{ item }}</Option>
      </Select>
    </FormItem>
    <!-- <FormItem label="备注信息" prop="explain">
      <Input v-model="formItem.explain" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="给FE留言"></Input>
    </FormItem> -->
    <FormItem label="上传文件" prop="files">
      <Upload
        ref="uploadFiles"
        :format="['zip', 'sketch']"
        multiple
        :before-upload="handleBeforeUpload"
        type="drag"
        :on-success="handleSuccess"
        :show-upload-list="false"
        action="http://localhost:3000/uploadFile">
        <div style="padding: 20px 0">
          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
          <p>请上传一个zip文件（压缩导出的Html）和一个sketch文件</p>
        </div>
      </Upload>
    </FormItem>
    <FormItem>
      <Button type="primary" @click="handleSubmit('formItem')" :loading="checkMessage.loadingStatus">提交</Button>
      <Button type="ghost" @click="handleCancel('formItem', 'uploadFiles')" style="margin-left: 8px" >Cancel</Button>
    </FormItem>
  </Form>
</template>
<script>

export default {
  props: {
    message: [Array, Object]
  },
  data () {
    const files = function(rule, value, callback){
      if(value.sketch == 0 || value.zip == 0){
        return callback(new Error("请上传文件"))
      }else{
        callback();
      }
    };
    return {
      checkMessage: {
        loadingStatus: false,
        resfiles: 0,
        dataStore: {},
        suc: true,
        errorFile: ''
      },
      formItem: {
        name: '',
        type: '',
        explain: '',
        files: {
            zip: 0,
            sketch: 0
        }
      },
      ruleValidate: {
        name: [{required: true, message: "项目名不能为空", type:"string", trigger: 'blur'}],
        type: [{required: true, message: "项目类型不能为空", type:"string", trigger: 'blur'}],
        explain: [{required: false, type:"string", trigger: 'blur'}],
        files: [{validator: files, required: true, message: "请上传两种类型的文件", trigger: 'blur'}]
      }
    }
  },

  methods: {
    handleBeforeUpload (newFile, key) {//文件数目验证，暂存
        const fileExt = newFile.name.replace(/.+\./, "").toLowerCase()

        if (this.formItem.files[fileExt] == 0){
            this.formItem.files[fileExt] = newFile;
            this.$Message.success(`成功保存${fileExt}文件`)
        } else {
            this.formItem.files[fileExt] = newFile;
            this.$Message.success(`成功替换${fileExt}文件`)
        }
        return false;
    },
    handleSubmit(name) {
        this.$refs[name].validate((valid) => {
            if (valid) {
                this.checkMessage.loadingStatus = true;
                this.uploadFiles();
                fetch('http://localhost:3000/uploadFile',{
                    method: "POST",
                    body: JSON.stringify(this.formItem)
                })
            } else {
                this.$Message.error('Are you kidding me?')
            }
        })
    },
    uploadFiles() {
      this.$refs.uploadFiles.post(this.formItem.files.sketch);
      this.$refs.uploadFiles.post(this.formItem.files.zip);
    },
    handleSuccess (res, file) {//验证zip内文件的情况，返回结果
      const fileExt = file.name.replace(/.+\./, "").toLowerCase();
      console.log(res);
      if (fileExt == 'zip') {
        if (res.error){
          this.checkMessage.suc = false;
          this.checkMessage.errorFile = res.error;
          //文件验证失败，
        } else {
          this.checkMessage.dataStore = res;
          //zip验证成功
        }
        this.checkMessage.resfiles++;
      } else if (fileExt == 'sketch') {
        this.checkMessage.resfiles++;
      }

      if (this.checkMessage.resfiles == 2) {
        if (this.checkMessage.suc == false) {
          this.$Message.error(`压缩文件内缺少${this.checkMessage.errorFile}文件，上传失败`);
        } else {
          this.$emit('resetdata', this.checkMessage.dataStore);
          this.$Message.success('上传成功');
        }
        this.checkMessage.resfiles = 0;
        this.checkMessage.suc = true;
        this.checkMessage.loadingStatus = false;
        this.handleCancel('formItem', 'uploadFiles');
      }
    },
    handleCancel(patr1, part2) {
        this.loadingStatus = false;
        this.formItem.files.zip = 0
        this.formItem.files.sketch = 0
        this.$refs[patr1].resetFields()
        this.$refs[part2].clearFiles()
    }
  }
}
</script>
<style scoped>
.my-form{
    width: 500px;
    margin: 0 auto;
    margin-top: 30px;
}
</style>
