<template lang="pug">
v-container
  v-row
    v-col(cols='12', xs='12', sm='12', md='12')
      v-card(v-for='lecture in lectures', :key='lecture.id')
        v-card-title 情報数学A
        v-card-subtitle 若林先生
        v-card-text 情報数学A懐かしい
</template>

<script>
export default {
  name: 'LectureIndexPage',
  data() {
    return {
      lectures: [],
    }
  },
  head() {
    return {
      title: 'レクチャー一覧',
    }
  },
  mounted() {},
  methods: {},
}
</script>
