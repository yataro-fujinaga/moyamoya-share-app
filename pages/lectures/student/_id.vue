<template lang="pug">
v-container
    v-card-title {{ lecture.name }}
    v-card-subtitle {{ lecture.teacher_name }} 先生
    <button @click="postFirebase('good')">good</button>  
    <button @click="postFirebase('bad')">bad</button> 
    
</template>

<script>
// student
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
    },
    methods: {
     postFirebase(reactionType){ 
      const database = this.$fire.firestore
      database
        .collection('lectures/'+this.$route.params.id+'/reactions')
        .add({
            ts: new Date(),
            type: reactionType,
        });
      }
    
    },
}
</script>
