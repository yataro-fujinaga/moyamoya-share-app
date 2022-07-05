<script>
export default {
  name: 'TeacherComp',
  data() {
    return {
      nowSlide: 1,
    }
  },
  methods: {
    nextSlide() {
      this.nowSlide += 1;
    },
    prevSlide() {
      this.nowSlide -= 1;
    }
  },
}
</script>

<template>
  <div>
    <div>{{nowSlide}}</div>
    <button @click="nextSlide">next</button>
  </div>
</template>
