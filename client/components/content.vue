<template>
    <div>
      <itemList 
        v-for="(item, index) in message" 
        :message="item" 
        :status="status" 
        :key="index" 
        @updateStore="updateStore"  
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
    // console.log(666, this.updateStore)
  },
  props: {
    message: Object,
    status: Boolean,
    updateStore: Function,
  },
  components: {
    itemList: itemList
  },
}
</script>
  