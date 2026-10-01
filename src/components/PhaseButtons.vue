<script setup lang="ts">
    import type { Phase } from '@/lib/types';

    const emit = defineEmits<{
        changePhase: [phase: Phase];
    }>();
    const props = defineProps<{ phase: Phase }>();

    function handleClick(phase: Phase) {
        emit('changePhase', phase);
    }
</script>

<template>
    <div class="phase-selector" :class="`${props.phase}`">
        <button
            @click="() => handleClick('focus')"
            :class="props.phase === 'focus' && 'selected'"
        >
            Focus
        </button>
        <button
            @click="() => handleClick('break')"
            :class="props.phase === 'break' && 'selected'"
        >
            Break
        </button>
    </div>
</template>

<style scoped>
    .phase-selector {
        display: flex;
        position: relative;
        gap: 1rem;
    }

    .phase-selector::after {
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

    .phase-selector.phase-selector.break::after {
        transform: translateX(calc(100% + 1rem));
    }

    .phase-selector > button {
        padding: var(--button-padding);
        font-weight: 4rem;
        transition: border 220ms ease-in-out;
        z-index: 100;
    }
</style>
