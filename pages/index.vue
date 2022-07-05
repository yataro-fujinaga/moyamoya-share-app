<template lang="pug">
v-container
  v-row
    v-col(cols='12', xs='12', sm='12', md='12')
      p あなたはどちらですか
      v-btn(to='/lectures/create') 先生
      v-btn(to='/lectures') 学生
</template>

<script>
export default {
  name: 'IndexPage',
  data() {
    return {}
  },
  head() {
    return {
      title: 'トップ',
    }
  },
  mounted() {},
  methods: {},
}
</script>
