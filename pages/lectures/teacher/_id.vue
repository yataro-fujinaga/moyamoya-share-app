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
  <button @click="nextSlide">進む</button>
  <button @click="prevSlide">戻る</button>
  <button @click="startLecture">授業開始</button>
  p {{moyamoya}}
  p {{page}}
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
      slideLogId: "",
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
        async nextSlide(){
            const database = this.$fire.firestore
            await this.getMoyamoya(this.page)
            if(this.moyamoya > 50){
                await this.delay(0.5) // すぐ次のスライドに進むともやもや度の表示が見れないため
                alert("もやもやが爆発する前に復習しましょう！")
            }else if(this.moyamoya <= 50){
                const nowTime = new Date()
                await database // 今のページのendTsを記録
                    .collection('lectures/'+this.$route.params.id+'/slideLogs')
                    .doc(this.slideLogId)
                    .update({
                        endTs: nowTime
                    })
                const addedDoc = await database // 次のページのstartTsを記録
                    .collection('lectures/'+this.$route.params.id+'/slideLogs')
                    .add({
                        page: this.page+1,
                        startTs: nowTime,
                        endTs: null
                    })
                this.slideLogId = addedDoc.id
                await this.delay(0.5) // すぐ次のスライドに進むともやもや度の表示が見れないため
                this.page += 1
                await this.getMoyamoya(this.page)
            }else {
                alert("エラーが発生しました")
            }
        },
        async prevSlide(){
            const nowTime = new Date()
            const database = this.$fire.firestore
            await database // 今のページのendTsを記録
                    .collection('lectures/'+this.$route.params.id+'/slideLogs')
                    .doc(this.slideLogId)
                    .update({
                        endTs: nowTime
                    })
            const addedDoc = await database // 次のページのendTsを記録
                .collection('lectures/'+this.$route.params.id+'/slideLogs')
                .add({
                    page: this.page-1,
                    startTs: nowTime,
                    endTs: null
                })
            
            this.slideLogId = addedDoc.id
            this.page -= 1
            this.getMoyamoya(this.page)
        },
        async startLecture(){
            const database = this.$fire.firestore
            const nowTime = new Date()
            this.page = 1
            const addDoc = await database
                .collection('lectures/'+this.$route.params.id+'/slideLogs')
                .add({
                    page: this.page,
                    startTs: nowTime,
                    endTs: null
                })
            this.slideLogId = addDoc.id
        },
        async getMoyamoya(page){
            const database = this.$fire.firestore
            let allGoodReaction = 0
            let allBadReaction = 0
            const nowSlideLogsDoc = await database
                .collection('lectures/'+this.$route.params.id+'/slideLogs')
                .where("page","==",page)
                .get()
            await Promise.all(nowSlideLogsDoc.docs.map(async (doc) =>{
                let endTs = doc.data().endTs
                if(doc.data().endTs === null){
                    
                    endTs = new Date()
                }
                const reaction = await database
                    .collection('lectures/'+this.$route.params.id+'/reactions')
                    .where("ts","<=",endTs)
                    .where("ts",">=",doc.data().startTs)
                    .get()
                const badReaction = reaction.docs.filter((element) => element.data().type === "bad")
                const goodReaction = reaction.docs.filter((element) => element.data().type === "good")
                allBadReaction += badReaction.length
                allGoodReaction += goodReaction.length
            }))
            if(allBadReaction+allGoodReaction === 0){
                this.moyamoya = 50
            }else{
                this.moyamoya = parseInt((allBadReaction/(allGoodReaction + allBadReaction))*100)
            }
            
        
        },
        delay(n){
            return new Promise(function(resolve){
                setTimeout(resolve,n*1000);
            });
        }

    },
}
</script>
