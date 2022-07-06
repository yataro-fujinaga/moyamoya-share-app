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
  mounted() {
    // ここでfirstore
  },
  methods: {
    registerLecture(){
      const database = this.$fire.firestore
      database
        .collection("lectures")
        .add({
            name: this.form.lecture_name,
            teacher_name: this.form.teacher_name,
        }).then((res) =>{
          this.$router.push('/lectures/teacher/'+res.id)
        })
        // .catch((error) => {
        //   console.log(error)
        // })
        
    },
  },
}
</script>
