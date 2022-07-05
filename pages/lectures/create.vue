<template lang="pug">
v-container
  v-row
    v-col(cols='12', xs='12', sm='12', md='12')
      v-form(ref='form')
        p.font-weight-bold 講義フォーム
        v-text-field(
          name='lecture_name',
          v-model='form.lecture_name',
          outlined,
          dense,
          autofocus,
          label='講義名'
        )
        v-text-field(
          name='teacher_name',
          v-model='form.teacher_name',
          outlined,
          dense,
          label='教員名'
        )
        v-btn.font-weight-bold.white--text(
          color='teal lighten-1',
          depressed,
          @click='registerLecture'
        ) 登録
</template>

<script>
export default {
  name: 'LectureCreatePage',
  data() {
    return {
      form: {
        lecture_name: null,
        teacher_name: null,
      },
    }
  },
  head() {
    return {
      title: 'レクチャー作成',
    }
  },
  mounted() {},
  methods: {
    registerLecture: async () => {
      const database = this.$fire.firestore
      try {
        await database.addDoc(
          database.collection(database, 'lectures', {
            name: this.form.lecture_name,
            
          })
        )
      } catch (error) {
        console.log(error)
      }
      const newId = 0 // 登録後のlectureの取得方法を調べる
      this.$store.commit("selected_lecture/setId", newId);
    },
  },
}
</script>
