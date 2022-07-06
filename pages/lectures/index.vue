<template lang="pug">
v-container
  v-row
    v-col(cols='12', xs='12', sm='12', md='12')
      v-card(v-for="lecture in lectures" v-bind:key="lecture.id" v-bind:to="'/lectures/' + lecture.id" )
          v-card-title {{ lecture.data.name }}
          v-card-subtitle {{ lecture.data.teacher_name }} 先生
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
          this.lectures.push({ id: doc.id, data: doc.data() })
        })
      })
  },
  methods: {},
}
</script>
