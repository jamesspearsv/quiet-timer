<script setup lang="ts">
    import { onMounted, ref, useTemplateRef, watch } from 'vue';
    import MuteButton from '@/components/MuteButton.vue';
    import TimerDisplay from '@/components/TimerDisplay.vue';
    import PhaseButtons from '@/components/PhaseButtons.vue';
    import SegmentDialog from '@/components/SegmentDialog.vue';
    import type { Phase, TimerStatus } from '@/lib/types.ts';
    import { TIMERS } from './lib/const';
    import ContextTracker from '@/components/ContextTracker.vue';

    const current_phase = ref<Phase>('focus');
    const current_timer = ref(TIMERS.focus);
    const timer_status = ref<TimerStatus>('stopped');
    const modal_open = ref(false);
    const muted = ref(false);
    const audio_element = useTemplateRef('audioElement');
    const timer_id = ref<number | null>(null);

    let audioContext: AudioContext;
    let track: MediaElementAudioSourceNode;

    function changePhase(new_phase?: Phase) {
        if (new_phase) {
            current_phase.value = new_phase;
        } else {
            let next_phase: Phase = 'focus';
            if (audio_element.value) {
                audio_element.value.pause();
            }

            if (current_phase.value === 'focus') next_phase = 'break';
            if (current_phase.value === 'break') next_phase = 'focus';
            current_phase.value = next_phase;
            modal_open.value = false;
        }
    }

    watch(current_phase, () => {
        current_timer.value = TIMERS[current_phase.value];
    });

    function resetTimer() {
        current_timer.value = TIMERS[current_phase.value];
    }

    function startTimer() {
        // Restart a finished timer
        if (current_timer.value < 1) resetTimer();

        timer_status.value = 'running';
        timer_id.value = setInterval(() => {
            current_timer.value -= 1;
        }, 1000);
    }

    function stopTimer() {
        timer_status.value = 'stopped';
        if (current_timer.value > 1) resetTimer();

        if (!timer_id.value) return;
        clearInterval(timer_id.value);
        timer_id.value = null;
    }

    function pauseTimer() {
        timer_status.value = 'paused';
        if (!timer_id.value) return;
        clearInterval(timer_id.value);
        timer_id.value = null;
    }

    function endSession() {
        if (!audio_element.value) return;

        audio_element.value.pause();
        modal_open.value = false;
    }

    function toggleMute() {
        muted.value = !muted.value;
    }

    function initAudio() {
        if (!audio_element.value) return;

        console.log('initializing audio track');
        audioContext = new AudioContext();
        track = audioContext.createMediaElementSource(audio_element.value);
        track.connect(audioContext.destination);
    }

    async function playAlert() {
        modal_open.value = true;

        if (!audio_element.value) return;

        if (!muted.value) {
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }

            audio_element.value.currentTime = 0;
            audio_element.value.play();
        }
    }

    onMounted(initAudio);
</script>

<template>
    <main>
        <PhaseButtons
            :phase="current_phase"
            @change-phase="(m: Phase) => changePhase(m)"
        />
        <TimerDisplay
            :current-timer="current_timer"
            :phase="current_phase"
            :status="timer_status"
            :timer-remaining="(current_timer / TIMERS[current_phase]) * 100"
            @start="startTimer"
            @stop="stopTimer"
            @pause="pauseTimer"
            @finish="playAlert"
        />
        <ContextTracker />
    </main>

    <!-- # Non-UI elements # -->
    <MuteButton :muted="muted" @toggle-mute="toggleMute" />
    <audio ref="audioElement" src="/retro-alarm-clock.mp3"></audio>
    <SegmentDialog
        :open="modal_open"
        :phase="current_phase"
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
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;

        padding-inline: 35%;
    }
</style>
