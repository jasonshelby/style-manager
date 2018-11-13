<template>
  <Form :model="innerData" 
    ref="innerData"
    :label-width="80"
    :rules="ruleValidate"
    class="my-form">
    <FormItem label="项目名称" prop="name">
      <Input v-model="innerData.name" placeholder="请输入项目名称"/>
    </FormItem>
    <FormItem label="项目类别" prop="type">
      <Select v-model="innerData.type">
        <Option v-for="(item, index) in message" :value="item" :key="index + 200">{{ item }}</Option>
      </Select>
    </FormItem>
    
    <!-- <FormItem label="备注信息" prop="explain">
      <Input v-model="innerData.explain" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="给FE留言"></Input>
    </FormItem> -->
    {{innerData}}
    <!-- :datasss="innerData" -->
    <FormItem label="上传文件" prop="files">
      <Upload
        ref="uploadFiles"
        :format="['zip', 'sketch']"
        multiple
        :before-upload="handleBeforeUpload"
        type="drag"
        :data="innerData"
        :max-size="100000000"
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
      <Button type="primary" @click="handleSubmit('innerData')" :loading="checkMessage.loadingStatus">提交</Button>
      <Button type="ghost" @click="handleCancel('innerData', 'uploadFiles')" style="margin-left: 8px" >Cancel</Button>
    </FormItem>
  </Form>
</template>
<script>

export default {
  props: {
    message: [Array, Object]
  },

  data () {
    return {
      checkMessage: {
        loadingStatus: false,
        resfiles: 0,
        dataStore: {},
        suc: true,
        errorFile: ''
      },
      innerData: {
        name: '',
        type: '',
        explain: '',
      },
      files: {
          zip: 0,
          sketch: 0
      },
      ruleValidate: {
        name: [{required: true, message: "项目名不能为空", type:"string", trigger: 'blur'}],
        type: [{required: true, message: "项目类型不能为空", type:"string", trigger: 'blur'}],
        explain: [{required: false, type:"string", trigger: 'blur'}],
        files: [{validator: (rule, value, callback) => {
          if(this.files.sketch == 0 || this.files.zip == 0){
            return callback(new Error("请上传文件"))
          }else{
            callback();
          }
        }, required: true, message: "请上传两种类型的文件", trigger: 'blur'}]
      }
    }
  },

  methods: {
    handleBeforeUpload (newFile, key) {//文件数目验证，暂存
      const fileExt = newFile.name.replace(/.+\./, "").toLowerCase()

      if (this.files[fileExt] == 0){
        this.files[fileExt] = newFile;
        this.$Message.success(`成功保存${fileExt}文件`)
      } else {
        this.files[fileExt] = newFile;
        this.$Message.success(`成功替换${fileExt}文件`)
      }
      return false;
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.checkMessage.loadingStatus = true;

          const myData = new FormData();

          myData.append('detail', JSON.stringify(this.innerData))
          myData.append('zip', this.files.zip)
          myData.append('sketch', this.files.sketch)


          // fetch('http://localhost:3000/demo',{
          //   method: "POST",
          //   body: myData,
          // })
          var xhr = new XMLHttpRequest()
          xhr.open("POST", "http://localhost:3000/uploadFile", true);

          xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
              var body = document.body
              var a = document.createElement('a')
              a.text = 'hahah'
              a.href = xhr.responseText
              body.appendChild(a)
              console.log(xhr.responseText)
            }
          }
          xhr.send(myData);

          
          // var xhr = new XMLHttpRequest()
          // xhr.open("POST", "http://localhost:3000/demo", true);

          // xhr.onreadystatechange = function () {
          //   if (xhr.readyState == 4 && xhr.status == 200) {
          //     console.log(xhr.responseText)
          //   }
          // }
          // xhr.send(myData);

          // this.uploadFiles();
          // fetch('http://localhost:3000/uploadFile',{
          //   method: "POST",
          //   body: JSON.stringify(this.innerData)
          // })
        } else {
          this.$Message.error('Are you kidding me?')
        }
      })
    },
    // uploadFiles() {
    //   this.$refs.uploadFiles.post(this.files.sketch);
    //   this.$refs.uploadFiles.post(this.files.zip);
    // },
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
        this.handleCancel('innerData', 'uploadFiles');
      }
    },
    handleCancel(part1, part2) {
        this.checkMessage.loadingStatus= false;
        this.files.zip = 0
        this.files.sketch = 0
        this.$refs[part1].resetFields()
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
