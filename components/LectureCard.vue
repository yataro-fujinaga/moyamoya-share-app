<template lang="pug">
div
  v-card-title {{ lecture.name }}
  v-card-subtitle 担当: {{ lecture.teacher_name }} 先生
</template>

<script>
export default {
  props: {
    lecture: { type: [Promise, Object], required: true },
  },
  methods: {
    Promise: (obj) => {
      return obj instanceof Promise
    },
  },
}
</script>
