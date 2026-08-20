<script setup>
    import { ref } from 'vue';

    const muted = ref(false);
</script>

<template>
    <button @click="() => (muted = !muted)">
        <i v-if="muted" class="bi bi-volume-mute-fill"></i>
        <i v-if="!muted" class="bi bi-volume-down-fill"></i>
    </button>
</template>

<style lang="css" scoped>
    button {
        position: fixed;
        top: 3rem;
        right: 3rem;
        aspect-ratio: 1/1;
        font-size: 2rem;
    }
</style>
