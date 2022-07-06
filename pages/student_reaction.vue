<template>
    <div>
        <button @click="postFirebase('good')">good</button>  
        <button @click="postFirebase('bad')">bad</button> 
    </div>
</template>

<script>
export default {
  data(){
    return{

    }
  },
  methods: {
    postFirebase(reactionType){ 
      const database = this.$fire.firestore
      database
        .collection('lectures/JngtPpv4ZQ9VwPUIca3C/reactions')
        .add({
            ts: new Date(),
            type: reactionType,
        });
      }
    },
}


</script>
