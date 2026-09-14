<script setup>
    const emit = defineEmits(['change-mode']);
    const { mode } = defineProps({
        mode: { type: String, required: true },
    });

    function handleClick(newMode) {
        emit('change-mode', newMode);
    }
</script>

<template>
    <div class="mode-selector" :class="`${mode}`">
        <button
            @click="() => handleClick('focus')"
            :class="mode === 'focus' && 'selected'"
        >
            Focus
        </button>
        <button
            @click="() => handleClick('break')"
            :class="mode === 'break' && 'selected'"
        >
            Break
        </button>
    </div>
</template>

<style scoped>
    .mode-selector {
        display: flex;
        position: relative;
        gap: 1rem;
    }

    .mode-selector::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: calc(50% + 1rem / 2);
        border: solid var(--clr-black) 2px;
        border-radius: var(--border-radius);
        transition: transform 220ms ease-in-out;
    }

    .mode-selector.mode-selector.break::after {
        transform: translateX(calc(100% + 1rem));
    }

    .mode-selector > button {
        padding: 1rem 2rem;
        font-weight: 4rem;
        transition: border 220ms ease-in-out;
        z-index: 100;
    }
</style>
