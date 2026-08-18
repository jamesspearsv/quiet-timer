<script setup>
    import { onMounted, ref, useTemplateRef } from 'vue';
    import Timer from './components/Timer.vue';
    const mode = ref('focus');
    const audioElement = useTemplateRef('audioElement');

    let audioContext;
    let track;

    function changeMode(new_mode) {
        mode.value = new_mode;
    }

    function initAudio() {
        console.log('initializing audio track');
        audioContext = new AudioContext();
        track = audioContext.createMediaElementSource(audioElement.value);
        track.connect(audioContext.destination);
    }

    async function playAlert() {
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        audioElement.value.play();
    }

    onMounted(initAudio);
</script>

<template>
    <main>
        <div>
            <div :class="`mode-selector ${mode}`">
                <button
                    @click="() => changeMode('focus')"
                    :class="mode === 'focus' && 'selected'"
                >
                    Focus
                </button>
                <button
                    @click="() => changeMode('break')"
                    :class="mode === 'break' && 'selected'"
                >
                    Break
                </button>
            </div>
            <Timer :mode="mode" @finished="playAlert()" />
        </div>
    </main>
    <audio ref="audioElement" src="/attention-chime.mp3"></audio>
</template>

<style scoped>
    main {
        background-color: #fafafa;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    main > div {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .mode-selector {
        display: flex;
        position: relative;
    }

    .mode-selector::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 50%;
        background-color: rgba(0, 0, 0, 0.07);
        transition: transform 220ms ease-in-out;
    }

    .mode-selector.mode-selector.break::after {
        transform: translateX(100%);
    }

    .mode-selector > button {
        background-color: transparent;
        border: none;
        padding: 1rem 2rem;
        font-family: inherit;
        font-weight: 4rem;
        transition: border 220ms ease-in-out;
        z-index: 100;
    }
</style>
