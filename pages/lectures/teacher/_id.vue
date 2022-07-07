<template lang="pug">
v-container
  v-row
  v-col(cols='12', xs='12', sm='12', md='12')
    BackButton(toUrl='/lectures')
    v-card.mb-2
      LectureCard(:lecture='lecture')
    h1 リアクション
    v-card.mb-2(v-for='reaction in reactions', v-bind:key='reaction.id')
      v-card-text
        p {{ reaction.data.ts }}
        p {{ reaction.data.type }}
</template>

<script>
import LectureCard from '~/components/LectureCard.vue'
// teacher
export default {
  name: 'LecturePage',
  components: { LectureCard },
  data() {
    return {
      lecture: {},
      reactions: [],
    }
  },
  head() {
    return {
      title: this.lecture.name,
    }
  },
  mounted() {
    const database = this.$fire.firestore
    this.lecture = database
      .collection('lectures')
      .doc(this.$route.params.id)
      .get()
      .then((doc) => {
        this.lecture = doc.data()
      })
    database
      .collection('lectures')
      .doc(this.$route.params.id)
      .collection('reactions')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.reactions.push({ id: doc.id, data: doc.data() })
        })
      })
  },
  methods: {},
}
</script>
