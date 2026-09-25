<script setup>
    import { onMounted, ref, useTemplateRef } from 'vue';
    import MuteButton from './components/MuteButton.vue';
    import TimerDisplay from './components/TimerDisplay.vue';
    import PhaseButtons from './components/PhaseButtons.vue';
    import SegmentDialog from './components/SegmentDialog.vue';

    const phase = ref('focus');
    const phaseModalOpen = ref(false);
    const muted = ref(false);
    const audioElement = useTemplateRef('audioElement');

    let audioContext;
    let track;

    function changePhase() {
        audioElement.value.pause();

        let next_phase;
        if (phase.value === 'focus') next_phase = 'break';
        if (phase.value === 'break') next_phase = 'focus';
        phase.value = next_phase;
        phaseModalOpen.value = false;
    }

    function endSession() {
        audioElement.value.pause();
        phaseModalOpen.value = false;
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
        phaseModalOpen.value = true;

        if (!muted.value) {
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }

            audioElement.value.currentTime = 0;
            audioElement.value.play();
        }
    }

    onMounted(initAudio);
</script>

<template>
    <main>
        <div>
            <PhaseButtons
                :phase="phase"
                @change-phase="(m) => changePhase(m)"
            />
            <TimerDisplay :phase="phase" @finished="playAlert" />
        </div>
        <MuteButton :muted="muted" @toggle-mute="toggleMute" />
    </main>
    <audio ref="audioElement" src="/retro-alarm-clock.mp3"></audio>
    <SegmentDialog
        :open="phaseModalOpen"
        :segment="phase"
        @stop="endSession"
        @next="changePhase"
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
