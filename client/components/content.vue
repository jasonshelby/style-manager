<template>
    <div>
      {{message}}
      <itemList v-for="(item, index) in message" :message="item" :status="status" :key="index" @resetdata="resetdata"></itemList>
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
    console.log(this.message)
    console.log(this.status)
  },
  props: {
    message: Object,
    status: Boolean
  },
  components: {
    itemList: itemList
  },
  methods: {
    resetdata(data) {
      this.$emit('resetdata', data);
    }
  }
}
</script>
  