<script setup>
    import { ref, computed, watch } from 'vue';

    const emit = defineEmits(['finished']);

    const timers = {
        focus: import.meta.env.PROD ? 1500 : 5,
        break: 300,
    };

    const { mode } = defineProps(['mode']);

    const active_timer = ref(timers[mode]);
    const status = computed(() => {
        if (!timer_id.value) {
            if (active_timer.value < timers[mode]) return 'paused';
            else return 'stopped';
        } else {
            if (active_timer.value === 0) return 'finished';
            else return 'running';
        }
    });
    const display = computed(() => {
        const minutes = Math.trunc(active_timer.value / 60);
        let seconds = active_timer.value % 60;

        if (seconds < 10) seconds = '0' + seconds;

        return { minutes, seconds };
    });
    const timer_id = ref(null);

    watch(
        () => mode,
        () => {
            stopTimer();
            active_timer.value = timers[mode];
        },
    );

    function startTimer() {
        const id = setInterval(() => {
            active_timer.value--;
            if (active_timer.value === 0) endTimer();
        }, 1000);
        timer_id.value = id;
        status.value = 'running';
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
    <h1 class="timer">{{ display.minutes }}:{{ display.seconds }}</h1>
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
    .timer {
        font-size: 5rem;
    }

    .buttons > * {
        background-color: transparent;
        padding: 1rem;
        border: none;
        font-family: inherit;
        font-size: 2rem;
    }
</style>
