<template lang="pug">
.back-button-wrap.mb-3
  v-btn(icon, :to='toUrl')
    v-icon mdi-arrow-left
</template>

<script>
export default {
  props: {
    toUrl: {
      type: String,
      required: true,
    },
  },
}
</script>
