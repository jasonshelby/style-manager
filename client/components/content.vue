<template>
    <div>
      <itemList v-for="(item, index) in message" :message="item" :status="status" :key="index + 100" @resetdata="resetdata"></itemList>
    </div>
</template>  

<script>

import itemList from './item-list.vue'

export default {
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
  