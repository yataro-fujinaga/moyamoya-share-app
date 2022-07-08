<template lang="pug">
v-container
  v-row
    v-col(cols='12', xs='12', sm='12', md='6')
      BackButton(toUrl='/lectures')
      v-card.mb-2
        LectureCard(:lecture='lecture')
    v-col(cols='12', xs='12', sm='12', md='6')
      v-card
        v-card-text(v-if='classStarted')
          .mb-2
            span.font-weight-bold モヤモヤ
            v-progress-linear(
              color='red',
              background-color='blue lighten-4',
              height='30',
              :value='moyamoya',
              striped
            )
          v-divider
        v-card-text(v-if='page !== 0')
          p.font-weight-bold ページ
          #slide-button.mb-4.d-flex
            v-col.text-center(cols='4')
              v-btn(depressed, fab, color='teal darken-1', @click='prevSlide') 
                v-icon.white--text mdi-arrow-left
            v-col.text-center(cols='4')
              v-btn.white--text.font-weight-bold(
                depressed,
                disabled,
                fab,
                color='teal lighten-2'
              ) {{ page }}
            v-col.text-center(cols='4')
              v-btn(depressed, fab, color='teal darken-1', @click='nextSlide')
                v-icon.white--text mdi-arrow-right
          #slide-slider
            v-slider(
              color='teal darken-1',
              thumb-label='always',
              v-model='page'
            )
          v-divider
        v-card-text
          v-btn.white--text(
            @click='startLecture',
            block,
            color='teal darken-1',
            v-if='!classStarted'
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
  methods: {
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
    async getMoyamoya(page) {
      const database = this.$fire.firestore
      let allGoodReaction = 0
      let allBadReaction = 0
      const nowSlideLogsDoc = await database
        .collection('lectures/' + this.$route.params.id + '/slideLogs')
        .where('page', '==', page)
        .get()
      await Promise.all(
        nowSlideLogsDoc.docs.map(async (doc) => {
          let endTs = doc.data().endTs
          if (doc.data().endTs === null) {
            endTs = new Date()
          }
          const reaction = await database
            .collection('lectures/' + this.$route.params.id + '/reactions')
            .where('ts', '<=', endTs)
            .where('ts', '>=', doc.data().startTs)
            .get()
          const badReaction = reaction.docs.filter(
            (element) => element.data().type === 'bad'
          )
          const goodReaction = reaction.docs.filter(
            (element) => element.data().type === 'good'
          )
          allBadReaction += badReaction.length
          allGoodReaction += goodReaction.length
        })
      )
      if (allBadReaction + allGoodReaction === 0) {
        this.moyamoya = 50
      } else {
        this.moyamoya = parseInt(
          (allBadReaction / (allGoodReaction + allBadReaction)) * 100
        )
      }
    },
    delay(n) {
      return new Promise(function (resolve) {
        setTimeout(resolve, n * 1000)
      })
    },
  },
}
</script>
