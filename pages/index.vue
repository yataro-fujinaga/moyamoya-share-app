<template lang="pug">
v-container
  v-row
    v-col(cols='12', xs='12', sm='12', md='12')
      p あなたはどちらですか
      v-btn(to='/lectures/create' class="pa-2 mr-3")
        v-icon mdi-human-male-board
        span 先生
      v-btn(to='/lectures' class="pa-2")
        v-icon mdi-account-school-outline
        span 学生
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
