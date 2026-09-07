<script setup>
    import { ref, computed, watch } from 'vue';

    const emit = defineEmits(['finished']);

    const timers = {
        focus: import.meta.env.PROD ? 1500 : 60,
        break: import.meta.env.PROD ? 300 : 5,
    };

    const { mode } = defineProps(['mode']);

    /** Active timer duration in seconds */
    const active_timer = ref(timers[mode]);

    /** Computed ref to track timer activity status */
    const status = computed(() => {
        if (!timer_id.value) {
            if (active_timer.value < timers[mode]) return 'paused';
            else return 'stopped';
        } else {
            if (active_timer.value === 0) return 'finished';
            else return 'running';
        }
    });

    /** Compute display values for timer in minutes and seconds */
    const display = computed(() => {
        const percent_complete =
            ((timers[mode] - active_timer.value) / timers[mode]) * 100;
        const minutes = Math.trunc(active_timer.value / 60);
        let seconds = active_timer.value % 60;

        if (seconds < 10) seconds = '0' + seconds;

        return { minutes, seconds, percent_complete };
    });
    const timer_id = ref(null);

    // Watcher to change timer duration when the timer's mode changes
    watch(
        () => mode,
        () => {
            stopTimer();
            active_timer.value = timers[mode];
        },
    );

    // Watch display ref and update page title accordingly
    watch(
        display,
        () => {
            document.title = `${mode} | ${display.value.minutes}:${display.value.seconds}`;
        },
        { immediate: true },
    );

    function startTimer() {
        const id = setInterval(() => {
            active_timer.value--;
            if (active_timer.value === 0) endTimer();
        }, 1000);
        timer_id.value = id;
    }

    function stopTimer() {
        if (timer_id.value) {
            clearInterval(timer_id.value);
            timer_id.value = null;
        }

        active_timer.value = timers[mode];
    }

    function pauseTimer() {
        if (!timer_id.value) return;
        clearInterval(timer_id.value);
        timer_id.value = null;
    }

    function endTimer() {
        clearInterval(timer_id.value);
        emit('finished');
    }

    function restartTimer() {
        active_timer.value = timers[mode];
        startTimer();
    }
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
            :style="{ width: display.percent_complete + '%' }"
        ></div>
    </div>
    <div class="buttons">
        <template v-if="status !== 'finished'">
            <button v-if="status === 'stopped'" @click="startTimer">
                Start
            </button>
            <button v-if="status === 'running'" @click="pauseTimer">
                Pause
            </button>
            <button v-if="status === 'paused'" @click="startTimer">
                Resume
            </button>
        </template>
        <template v-else>
            <button @click="restartTimer">Restart</button>
        </template>
        <button v-if="status !== 'stopped'" @click="stopTimer">Stop</button>
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

    .buttons > * {
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
