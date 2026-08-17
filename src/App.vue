<script setup>
    import { ref, computed } from 'vue';

    const timers = {
        focus: 5,
        short_break: 200,
    };

    const active_timer = ref(timers.focus);
    const status = computed(() => {
        if (!timer_id.value) {
            if (active_timer.value < timers.focus) return 'paused';
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

        active_timer.value = timers.focus;
    }

    function pauseTimer() {
        if (!timer_id.value) return;
        clearInterval(timer_id.value);
        timer_id.value = null;
    }

    function endTimer() {
        clearInterval(timer_id.value);
    }

    function restartTimer() {
        active_timer.value = timers.focus;
        startTimer();
    }
</script>

<template>
    <main>
        <div>
            <div class="mode-selector">
                <button>Focus</button>
                <button>Break</button>
            </div>
            <p>{{ status }}</p>
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
                    <button v-if="status !== 'stopped'" @click="stopTimer">
                        Stop
                    </button>
                </template>
                <template v-else>
                    <button @click="restartTimer">Restart</button>
                </template>
            </div>
        </div>
    </main>
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
    }

    .mode-selector > button {
        background: rgba(0, 0, 0, 0.081);
    }

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
