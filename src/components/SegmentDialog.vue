<script setup lang="ts">
    import type { Phase } from '@/lib/types';
    import { onMounted, useTemplateRef, watch } from 'vue';

    const dialog = useTemplateRef('dialog');
    defineEmits(['next', 'stop']);
    const props = defineProps<{
        open: Boolean;
        phase: Phase;
    }>();

    const modalMessage = {
        focus: 'Nice work! Time for a break!',
        break: 'Ready? Time to focus!',
    };

    function toggleModal() {
        if (!dialog.value) return;

        if (props.open) {
            dialog.value.showModal();
        } else {
            dialog.value.close();
        }
    }

    onMounted(toggleModal);
    watch(() => props.open, toggleModal);
</script>

<template>
    <dialog ref="dialog">
        <h2>{{ modalMessage[props.phase] }}</h2>
        <div class="button-container">
            <button @click="() => $emit('stop')">End Session</button>
            <button @click="() => $emit('next')">Next</button>
        </div>
    </dialog>
</template>

<style scoped>
    dialog {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;

        padding: 2rem;
        text-align: center;

        border: none;
        border-radius: var(--border-radius);

        background-color: var(--clr-white);
    }

    dialog::backdrop {
        background-color: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(5px);
    }

    h2 {
        margin-bottom: 2rem;
    }

    button {
        padding: 1rem;
    }

    .button-container {
        margin-top: auto;
    }
</style>
