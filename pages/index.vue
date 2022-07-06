<template lang="pug">
v-container
  v-row
    v-col(cols='12', xs='12', sm='12', md='12')
      p あなたはどちらですか
      v-btn(to='/lectures' @click='setUserType("teacher")' class="pa-2 mr-3")
        v-icon mdi-human-male-board
        span 先生
      v-btn(to='/lectures' @click='setUserType("student")' class="pa-2")
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
  methods: {
    setUserType(type){
      this.$store.commit("user/setType", type);
      console.log(this.$store.state.user.type)
    },
  },
}
</script>
