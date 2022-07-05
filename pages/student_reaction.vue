<template>
    <div>
        test
        <button @click="postFirebase">post</button>   
    </div>
</template>

<script>
export default {
  data(){
    return{

    }
  },
  methods: {
    postFirebase: async (formObj,reactionType) => {
      const database = this.$fire.firestore
      try {
        await database.addDoc(
          database.collection(database, 'lectures/reactions/JngtPpv4ZQ9VwPUIca3C/reactions', {
            ts: Date.now(),
            type: "good",
            uid: "test",
          })
        )
      } catch (error) {
        console.log(error)
      }
    },
    // beforePost(){

    // }
    
  }
  
}


</script>
