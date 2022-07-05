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
    postFirebase(reactionType){
      const database = this.$fire.firestore
      database
        .collection('lectures/JngtPpv4ZQ9VwPUIca3C/reactions')
        .add({
            ts: Date.now(),
            type: "good",// とりあえず
          }
        ).then(()=>{
          console.log("post");
        });
      }
    },
    // beforePost(){

    // }
    
  
  
}


</script>
