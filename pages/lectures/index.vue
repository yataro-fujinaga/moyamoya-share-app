<template lang="pug">
v-container
  v-row
    v-col(cols='12', xs='12', sm='12', md='12')
      v-card(v-for='lecture in lectures', :key='lecture.id')
        v-card-title {{ lecture.name }}
        v-card-subtitle {{ lecture.teacher_name }} 先生
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
  mounted() {
    const database = this.$fire.firestore
    database
      .collection('lectures')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.lectures.push(doc.data())
        })
      })
  },
  methods: {},
}
</script>
