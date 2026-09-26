<script setup lang="ts">
    import type { Phase, TimerStatus } from '@/lib/types';
    import { ref, computed, watch } from 'vue';

    const emit = defineEmits(['start', 'pause', 'finish', 'stop']);
    const props = defineProps<{
        currentTimer: number;
        timerRemaining: number;
        status: TimerStatus;
        phase: Phase;
    }>();

    /** Compute display values for timer in minutes and seconds */
    const display = computed(() => {
        const minutes = Math.trunc(props.currentTimer / 60).toString();
        let seconds = (props.currentTimer % 60).toString();

        if (Number(seconds) < 10) {
            seconds = '0' + seconds;
        }

        return { minutes, seconds };
    });

    watch(
        () => props.currentTimer,
        () => {
            if (props.currentTimer === 0) {
                emit('stop');
                emit('finish');
            }
        },
    );

    // Watch display ref and update page title accordingly
    watch(
        display,
        () => {
            document.title = `${props.phase} | ${display.value.minutes}:${display.value.seconds}`;
        },
        { immediate: true },
    );
</script>

<template>
    <div :class="`timer ${status}`">
        <span>
            {{ display.minutes }}
        </span>
        <span class="seperator">:</span>
        <span>
            {{ display.seconds }}
        </span>
    </div>
    <div class="timer-percent">
        <div
            class="timer-completed"
            :class="`${status}`"
            :style="{ width: props.timerRemaining + '%' }"
        ></div>
    </div>
    <div class="control-buttons">
        <template v-if="status !== 'finished'">
            <button v-if="status === 'stopped'" @click="() => $emit('start')">
                {{ currentTimer > 0 ? 'Start' : 'Restart' }}
            </button>
            <button v-if="status === 'running'" @click="() => $emit('pause')">
                Pause
            </button>
            <template v-if="status === 'paused'">
                <button @click="() => $emit('start')">Resume</button>
                <button @click="() => $emit('stop')">Stop</button>
            </template>
        </template>
        <template v-else>
            <button @click="() => null">Restart</button>
        </template>
    </div>
</template>

<style scoped>
    @keyframes paused-animation {
        to {
            transform: scale(1.04);
        }

        from {
            transform: scale(1);
        }
    }

    .timer {
        font-size: 5rem;
        font-weight: bold;
        margin: 3rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all linear 220ms;
    }

    .timer.paused {
        color: var(--clr-gray);
        animation: paused-animation 1000ms linear infinite alternate;
    }

    .control-buttons > * {
        padding: 1rem;
        font-size: 2rem;
    }

    /* 
    TODO: Update and improve timer status styles
    * These styles would be better defined using
    * reactive style objects in the component script 
    */

    .timer-percent {
        align-self: flex-start;
        border-radius: 3px;
        width: 100%;
        height: 5px;
        margin-block: 1rem;
        background-color: var(--clr-shaded);
    }

    .timer-completed {
        transition: all 250ms linear;
        background-color: #70ae6e;
        border-radius: inherit;
        height: inherit;
    }

    .timer-completed.paused {
        background-color: #fec601;
    }
</style>
