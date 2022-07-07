<template lang="pug">
v-container
  v-row
    v-col(cols='12', xs='12', sm='12', md='12')
      .add-lecture-button.mb-2.text-right(
        v-if='$store.state.user.type === "teacher"'
      )
        v-btn(color='red lighten-1', depressed, to='/lectures/create')
          v-icon.white--text mdi-plus
      v-card.mb-2(
        v-for='lecture in lectures',
        v-bind:key='lecture.id',
        @click='ToLecture(lecture.id)'
      )
        v-card-title {{ lecture.data.name }}
        v-card-subtitle
          span 担当: {{ lecture.data.teacher_name }} 先生
</template>

<script>
import LectureCard from '~/components/LectureCard.vue'
export default {
  name: 'LectureIndexPage',
  components: { LectureCard },
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
  methods: {
    ToLecture(id) {
      const userType = this.$store.state.user.type
      switch (userType) {
        case 'student':
          this.$router.push('/lectures/student/' + id)
          break
        case 'teacher':
          this.$router.push('/lectures/teacher/' + id)
          break
        default:
          this.$router.push('/')
      }
    },
  },
}
</script>
