<template lang="pug">
v-container
    v-card-title {{ lecture.name }}
    v-card-subtitle {{ lecture.teacher_name }} 先生
</template>

<script>
export default {
    name: 'LecturePage',
    data() {
        return {
            lecture: {},
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
    methods: {},
}
</script>
