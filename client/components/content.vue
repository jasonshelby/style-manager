<template>
    <div>
      <itemList 
        v-for="(item, index) in message" 
        :message="item" 
        :status="status" 
        :key="index" 
        @updataStore="updataStore"  
      ></itemList>
    </div>
</template>  

<script>

import itemList from './item-list.vue'

export default {
  data: () =>{
    return {
      name: 'sdsd',
    }
  },
  mounted() {
    // console.log(666, this.updataStore)
  },
  props: {
    message: Object,
    status: Boolean,
    updataStore: Function,
  },
  components: {
    itemList: itemList
  },
}
</script>
  