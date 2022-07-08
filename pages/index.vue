<template lang="pug">
v-container
  v-row
    v-col(cols='12', xs='12', sm='12', md='12')
      p.text-center.font-weight-bold あなたはどちらですか
      .moyamoya-image-wrap.d-flex.justify-center.mb-4
        v-avatar(color='teal lighten-2', size='200')
          v-img(:src='imageSrc', max-width='200')
      .text-center
        v-btn.pa-2.mr-3(
          depressed,
          color='teal',
          @click='setUserType("teacher")'
        )
          v-icon.white--text mdi-human-male-board
          span.white--text.font-weight-bold 先生
        v-btn.pa-2(depressed, color='teal', @click='setUserType("student")')
          v-icon.white--text mdi-account-school-outline
          span.white--text.font-weight-bold 学生
</template>

<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      imageSrc: require('@/assets/images/moyamoya.png'),
    }
  },
  head() {
    return {
      title: 'トップ',
    }
  },
  mounted() {},
  methods: {
    setUserType(type) {
      this.$store.commit('user/setType', type)
      this.$router.push('/lectures')
    },
  },
}
</script>
