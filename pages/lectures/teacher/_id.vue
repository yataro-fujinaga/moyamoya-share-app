<template lang="pug">
v-container
    v-card-title {{ lecture.name }}
    v-card-subtitle {{ lecture.teacher_name }} 先生
    h1 リアクション
    // それぞれのリアクションを表示する
    v-card(v-for="reaction in reactions" v-bind:key="reaction.id")
       p {{ reaction.data.ts }}
       p {{ reaction.data.type }}
</template>

<script>
// teacher
export default {
    name: 'LecturePage',
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
