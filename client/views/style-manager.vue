<template>
  <div class="layout">
    <Header>
      <span class="L-head">曼哈顿样式管理</span>
      <Button class="changeBut" v-if="!isFE" @click="changeToFE" type="success">当前为UE模式</Button>
      <Button class="changeBut" v-else @click="changeToUE">当前为FE模式</Button>
    </Header>
    <Layout>
      <Sider hide-trigger :style="{background: '#fff'}" ref="side_menu" >
        
        <Menu :active-name="activeName" theme="light" width="auto" :open-names="['1']" @on-select="handleTap" >
          <MenuItem name="0" v-if="!isFE">
            <Icon type="plus-round"></Icon>
            添加文档
          </MenuItem>
          <MenuItem :name="index + 1" v-for="(item, index) in siderData" :key="index + 10">
            <!-- <Icon type="ios-navigate"></Icon> -->
            {{ item }}
          </MenuItem>
        </Menu>
      </Sider>

      <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
        <Formpage v-if="siderNum == 0" :message="siderData" @updateStore="updateStore" ></Formpage>
        <ContentPage v-else :message="listData" :updateStore="updateStore" :status="isFE"></ContentPage>
      </Content>
    </Layout>

    <Modal v-model="askbut" width="360">
        <p slot="header" style="color:#f60;text-align:center">
            <Icon type="information-circled"></Icon>
            <span>我还不知道您的身份</span>
        </p>
        <div style="text-align:center">
            <h1>请问您是？</h1>
        </div>
        <div slot="footer">
            <Button type="ghost" @click="changeToFE">我是FE</Button>
            <Button type="ghost" @click="changeToUE">我是UI</Button>
        </div>
    </Modal>

  </div>
</template>

<script>

import Formpage from '../components/form.vue'
import ContentPage from '../components/content.vue'

export default {
  components: {
    Formpage: Formpage,
    ContentPage: ContentPage
  },

  data() {
    return {
      isFE: true,
      activeName: 0,
      siderNum: 1,
      Alldata: {},
      siderData: {},
      listData: {},//具体到每个
      askbut: false
    }
  },
  watch: {
    Alldata() {
      if(this.siderNum != 0) {
        this.listData = this.Alldata.files[this.siderData[this.siderNum - 1]];
      }
    },
    siderNum() {
      this.listData = this.Alldata.files[this.siderData[this.siderNum - 1]];
    }
  },
  methods: {
    handleTap(index) {
      this.siderNum = index;
      this.listData = this.Alldata.files[this.siderData[this.siderNum - 1]];
    },
    updateStore (newConfig) {
      console.log('父级执行更新，数据:', newConfig)
      if (newConfig.deleteMessage) {
        //删除
        this.$delete( this.Alldata.files[newConfig.deleteMessage.type], [newConfig.deleteMessage.name] )
      } else {
        let projectMessage = this.Alldata.files[newConfig.type][newConfig.name]
  
        if(projectMessage) {
          //替换
          projectMessage = Object.assign(projectMessage, newConfig);
        } else {
          //添加
          this.Alldata.files[newConfig.type][newConfig.name] = newConfig
        }
      }
    },
    changeToUE() {
      this.isFE = false;
      localStorage.setItem("isFE", 0);
      this.askbut = false;
    },
    changeToFE() {
      if (this.siderNum == 0) {
        this.siderNum = 1;
        this.activeName = 1;
      }
      this.isFE = true;
      localStorage.setItem("isFE", 1);
      this.askbut = false;
    },
    handleAn(booleanNum) {
      localStorage.setItem('isFE', booleanNum);
      this.activeName = booleanNum;
      this.siderNum = booleanNum;
    }
  },
  created() {
    fetch('http://localhost:3000/')
    .then(res => {
      return res.text();
    })
    .then(res => {
      const data = JSON.parse(res);
      console.log('全局数据: ', data)

      this.Alldata = data;
      this.siderData = data.types;
    })
  },
  mounted() {
    if (localStorage.getItem("isFE") === null) {
      this.askbut = true;
    } else if (localStorage.getItem("isFE") == '0'){
      this.changeToUE();
    } else if (localStorage.getItem("isFE") == '1'){
      this.changeToFE();
    }
  }
}
</script>

<style scoped>

.L-head{
  font-size: 23px;
  color: white;
  float: left;
}
.changeBut{
  float: right;
  margin-top: 15px;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.layout{
    border: 1px solid #d7dde4;
    border-bottom: none;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}
.layout-logo{
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
}
.layout-nav{
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
}
</style>
