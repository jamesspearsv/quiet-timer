<script setup>
    import { onMounted, ref, useTemplateRef } from 'vue';
    import MuteButton from './components/MuteButton.vue';
    import TimerDisplay from './components/TimerDisplay.vue';
    import PhaseButtons from './components/PhaseButtons.vue';
    import SegmentDialog from './components/SegmentDialog.vue';
    import { goToNextPhase } from './lib/segmentController.js';

    const phase = ref('focus');
    const segmentModalOpen = ref(true);
    const muted = ref(false);
    const audioElement = useTemplateRef('audioElement');

    let audioContext;
    let track;

    function changePhase(new_phase) {
        phase.value = new_phase;
    }

    function toggleMute() {
        muted.value = !muted.value;
    }

    function initAudio() {
        console.log('initializing audio track');
        audioContext = new AudioContext();
        track = audioContext.createMediaElementSource(audioElement.value);
        track.connect(audioContext.destination);
    }

    async function playAlert() {
        if (muted.value) return;

        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        segmentModalOpen.value = true;
        audioElement.value.play();
    }

    onMounted(initAudio);
</script>

<template>
    <main>
        <div>
            <PhaseButtons :phase="phase" @change-mode="(m) => changePhase(m)" />
            <TimerDisplay :phase="phase" @finished="playAlert()" />
        </div>
        <MuteButton :muted="muted" @toggle-mute="toggleMute()" />
    </main>
    <audio ref="audioElement" src="/mission-complete-chime.mp3"></audio>
    <SegmentDialog
        :open="segmentModalOpen"
        :segment="phase"
        @stop="() => (segmentModalOpen = false)"
        @next="() => (phase = goToNextPhase(phase))"
    />
</template>

<style scoped>
    main {
        background-color: var(--clr-white);
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
</style>
