<template>
    <div class="item-list" >
      <Card class="item-card">
        <p slot="title" class="card-title">
          <Icon type="ios-film-outline"></Icon>
          <span>{{ message.name }}</span> 
        </p>
        <span slot="extra" class="card-extra">
          <Icon type="ios-timer-outline"></Icon>
          {{ updataTime }}
        </span>
        <ButtonGroup class="f-left">
          <span> </span>
          <Button type="ghost" @click="handleCheckout(message.static + 'static/index.html')" >
            <Icon type="ios-eye"></Icon>
            查看
          </Button>
          <Button 
            type="ghost" 
            class="f-left"
            @click="handleDownLoad(message.static + message.zipName, message.zipName)"
            v-show="status">下载zip</Button>
          <Button 
            type="ghost" 
            class="f-left"
            @click="handleDownLoad(message.static + message.sketchName, message.sketchName)"
            v-show="status">下载sketch</Button>
        </ButtonGroup>
        <Button type="ghost" @click="del()" class="f-right">
          <Icon type="trash-a"></Icon>
          删除
        </Button>

        <Upload
          class="f-left"
          v-show="!status"
          style="width:105px; display:inline-block"
          ref="updataFiles"
          :format="['zip', 'sketch']"
          :before-upload="handleBeforeUpload"
          :on-success="handleSuccess"
          :show-upload-list="false"
          action="http://localhost:3000/updateFile">
          <Button  type="ghost" icon="ios-cloud-upload-outline" :loading="loadingStatus">更新文件</Button>
        </Upload>

        <div class="clear"></div>

        <Modal v-model="modal" width="360">
          <p slot="header" style="color:#f60;text-align:center">
            <Icon type="information-circled"></Icon>
            <span>删除确认</span>
          </p>
          <div style="text-align:center">
            <p>删除之后，文件将无法恢复，确认删除吗?</p>
          </div>
          <div slot="footer">
            <Button type="error" size="large" long :loading="modal_loading" @click="handleDelete(message)">删除</Button>
          </div>
        </Modal>
      </Card>
    </div>
</template>
<script>

export default {
  props: {
    message: Object,
    status: Boolean
  },

  data() {
    return {
      updataTime: '',
      loadingStatus : false,
      modal: false,
      modal_loading: false,
    }
  },
  watch: {
    message(val) {
      this.setTime(val.updataTime);
    }
  },
  created() {
    this.setTime(this.message.updataTime);
  },

  methods: {
    setTime(timeNum) {
      const date = new Date(timeNum);
      let minute = date.getMinutes(timeNum).toString();
        if(minute.length == 1) {
          minute = '0' + minute;
        }
      this.updataTime = `${date.getMonth(timeNum) + 1}月${date.getDate(timeNum) + 1}日
        ${date.getHours(timeNum)}:${minute}`;
    },
    handleBeforeUpload(file){
      const myData = new FormData();
      const fileFormat = file.name.split('.').pop()

      myData.append('detail', JSON.stringify({
        name: this.message.name,
        type: this.message.type,
      }))
      myData.append(fileFormat, file)

      var xhr = new XMLHttpRequest()
      xhr.open("POST", "http://localhost:3000/updateFile", true);
      xhr.onreadystatechange =  () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          this.handleSuccess(JSON.parse(xhr.responseText))
        }
      }
      xhr.send(myData);
      this.loadingStatus = true;
      // fetch('http://localhost:3000/updateFile', {
      //     method: "POST",
      //     body: this.message.path
      // })
      // .then(res => {
      //   return res.text();
      // })
      // .then(res => {
      //   console.log(res);
      // })

      return false
    },
    handleSuccess (res) {
      if(res.success) {
        console.log(555, res)
        this.$emit('updataStore', res.data);

        this.$Message.success('更新成功')

      } else {
        this.$Message.error(`压缩文件内缺少${res.error}文件，上传失败`);
      }
      this.loadingStatus = false;
    },
    del() {
      this.modal = true;
    },
    handleDelete(config) {
      this.modal_loading = true;
      fetch('http://localhost:3000/deleteFile', {
        method: "POST",
        body: JSON.stringify(config)
      })
      .then(res => {
        return res.text();
      })
      .then(res => {
        res = JSON.parse(res)
        console.log(res)
        if (res.success) {
          this.$emit('updataStore', {
            deleteMessage: res.data
          });
          this.modal_loading = false;
          this.modal = false;
          this.$Message.success('删除成功');
        }
        
      })
    },
    handleDownLoad(content, filename) {
      // 创建隐藏的可下载链接
      var eleLink = document.createElement('a');
      eleLink.download = filename;
      eleLink.style.display = 'none';
      eleLink.href = content;
      // 触发点击
      document.body.appendChild(eleLink);
      eleLink.click();
      // 然后移除
      document.body.removeChild(eleLink);
    },
    handleCheckout(path) {
      window.open(path);
    }
  }
}
</script>


<style>
.item-card{
  margin-bottom: 20px;
  margin-left: 1%;
  margin-right: 1%;
  width: 48%;
  float: left;
  /* cursor: pointer; */
  /* height: 118px; */
  min-width: 345px;
}

.card-title{
  text-align: left;
}
.card-title span{
  font-size: 16px;
}

.card-extra{
  font-size: 12px;
}

.button-group{
  float: left;
  /* padding-bottom: 20px; */
}

.f-left{
  float: left;
}

.f-right{
  float: right;

}

.clear{
  clear: both;
  display: block;
  content: '',
}
  


</style>

