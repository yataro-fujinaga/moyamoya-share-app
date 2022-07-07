<template lang="pug">
v-container
  v-row
    v-col(cols='12', xs='12', sm='12', md='12')
      BackButton(toUrl='/lectures')
      v-card.mb-2
        LectureCard(:lecture='lecture')
      .reaction-button.d-flex
        v-col.text-center(cols='6', xs='6', sm='6', md='6')
          v-btn(@click='postFirebase("good")', fab, color='primary') 
            v-icon mdi-thumb-up
        v-col.text-center(cols='6', xs='6', sm='6', md='6')
          v-btn(@click='postFirebase("bad")', fab, color='error') 
            v-icon mdi-thumb-down
</template>

<script>
import LectureCard from '~/components/LectureCard.vue'
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
  },
  methods: {
    postFirebase(reactionType) {
      const database = this.$fire.firestore
      database
        .collection('lectures/' + this.$route.params.id + '/reactions')
        .add({
          ts: new Date(),
          type: reactionType,
        })
    },
  },
}
</script>
