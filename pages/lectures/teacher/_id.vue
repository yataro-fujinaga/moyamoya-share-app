<template lang="pug">
v-container
  v-row
    v-col(cols='12', xs='12', sm='12', md='6')
      BackButton(toUrl='/lectures')
      v-card.mb-2
        LectureCard(:lecture='lecture')
      h1 リアクション
      v-card.mb-2(v-for='reaction in reactions', v-bind:key='reaction.id')
        v-card-text
          p {{ reaction.data.ts }}
          p {{ reaction.data.type }}
    v-col(cols='12', xs='12', sm='12', md='6')
      v-card
        v-card-title.font-weight-bold モヤモヤ
        v-divider
        v-card-text
          .mb-2(v-if='page !== 0')
            v-progress-linear(
              color='red',
              background-color='blue lighten-4',
              height='10',
              :value='moyamoya',
              striped
            )
          v-btn.white--text(
            @click='startLecture',
            block,
            color='teal darken-1',
            v-if='page === 0'
          )
            v-icon mdi-play
            span 授業開始
          v-btn.white--text(
            @click='finishLecture',
            block,
            color='teal darken-1',
            v-else
          )
            v-icon mdi-stop
            span 授業終了
          #slide-button.mt-2.d-flex(v-if='page !== 0')
            v-col.text-center(cols='6')
              v-btn(depressed, fab, color='teal darken-1', @click='prevSlide') 
                v-icon.white--text mdi-arrow-left
            v-col.text-center(cols='6')
              v-btn(depressed, fab, color='teal darken-1', @click='nextSlide')
                v-icon.white--text mdi-arrow-right

    p {{ moyamoya }}
    p {{ page }}
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
      moyamoya: 50,
      page: 0,
      slideLogId: '',
      classStarted: false,
      lectureOnSnapshot: null,
      reactionsOnSnapshot: null,
      currentSlideLogsOnSnapshot: null,
      currentSlideLogs: []
    }
  },
  head() {
    return {
      title: this.lecture.name,
    }
  },
  mounted() {
    const database = this.$fire.firestore
    this.lectureOnSnapshot = database
      .collection('lectures')
      .doc(this.$route.params.id)
      .onSnapshot((doc) => {
        this.lecture = doc.data()
      })
    this.reactionsOnSnapshot = this.fetchReactions()
    this.currentSlideLogsOnSnapshot = this.fetchCurrentSlideLogs()
  },
  destroyed() {
    this.lectureOnSnapshot();
    this.reactionsOnSnapshot();
    this.currentSlideLogsOnSnapshot();
    console.log('destroyed');
  },
  updated() {
    this.currentSlideLogsOnSnapshot();
    this.currentSlideLogsOnSnapshot = this.fetchCurrentSlideLogs()
    this.getMoyamoya()
  },
  methods: {
    fetchReactions() {
      const database = this.$fire.firestore
      return database
        .collection('lectures')
        .doc(this.$route.params.id)
        .collection('reactions').onSnapshot((querySnapshot) => {
          this.reactions = []
          querySnapshot.forEach((doc) => {
            this.reactions.push({ id: doc.id, data: doc.data() })
          })
        })
    },
    fetchCurrentSlideLogs() {
      const database = this.$fire.firestore
      return database
        .collection('lectures/' + this.$route.params.id + '/slideLogs')
        .where('page', '==', this.page)
        .onSnapshot(
          (querySnapshot) => {
            this.currentSlideLogs = []
            querySnapshot.forEach((doc) => {
              this.currentSlideLogs.push({ id: doc.id, data: doc.data() })
            })
          }
        )
    },
    async nextSlide() {
      const database = this.$fire.firestore
      await this.getMoyamoya(this.page)
      if (this.moyamoya > 50) {
        await this.delay(0.5) // すぐ次のスライドに進むともやもや度の表示が見れないため
        alert('もやもやが爆発する前に復習しましょう！')
      } else if (this.moyamoya <= 50) {
        const nowTime = new Date()
        await database // 今のページのendTsを記録
          .collection('lectures/' + this.$route.params.id + '/slideLogs')
          .doc(this.slideLogId)
          .update({
            endTs: nowTime,
          })
        const addedDoc = await database // 次のページのstartTsを記録
          .collection('lectures/' + this.$route.params.id + '/slideLogs')
          .add({
            page: this.page + 1,
            startTs: nowTime,
            endTs: null,
          })
        this.slideLogId = addedDoc.id
        await this.delay(0.5) // すぐ次のスライドに進むともやもや度の表示が見れないため
        this.page += 1
        await this.getMoyamoya(this.page)
      } else {
        alert('エラーが発生しました')
      }
    },
    async prevSlide() {
      const nowTime = new Date()
      const database = this.$fire.firestore
      await database // 今のページのendTsを記録
        .collection('lectures/' + this.$route.params.id + '/slideLogs')
        .doc(this.slideLogId)
        .update({
          endTs: nowTime,
        })
      const addedDoc = await database // 次のページのendTsを記録
        .collection('lectures/' + this.$route.params.id + '/slideLogs')
        .add({
          page: this.page - 1,
          startTs: nowTime,
          endTs: null,
        })

      this.slideLogId = addedDoc.id
      this.page -= 1
      this.getMoyamoya(this.page)
    },
    async startLecture() {
      const database = this.$fire.firestore
      const nowTime = new Date()
      this.page = 1
      const addDoc = await database
        .collection('lectures/' + this.$route.params.id + '/slideLogs')
        .add({
          page: this.page,
          startTs: nowTime,
          endTs: null,
        })
      this.slideLogId = addDoc.id
      this.classStarted = true
    },
    async finishLecture() {
      await this.deleteCollection(
        'lectures/' + this.$route.params.id + '/slideLogs'
      )
      await this.deleteCollection(
        'lectures/' + this.$route.params.id + '/reactions'
      )
      this.classStarted = false
    },
    async deleteCollection(path) {
      const database = this.$fire.firestore
      const delCollection = await database.collection(path).get()
      console.log(delCollection)
      await Promise.all(
        delCollection.docs.map(async (doc) => {
          await database.collection(path).doc(doc.id).delete()
        })
      )
    },
    getMoyamoya(page) {
      // よしなに
    },
    delay(n) {
      return new Promise(function (resolve) {
        setTimeout(resolve, n * 1000)
      })
    },
  },
}
</script>
