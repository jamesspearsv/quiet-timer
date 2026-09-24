<script setup>
    import { onMounted, useTemplateRef, watch } from 'vue';

    const dialog = useTemplateRef('dialog');
    defineEmits(['next', 'stop']);
    const props = defineProps({
        open: {
            type: Boolean,
            required: true,
        },
        segment: {
            type: String,
            required: true,
        },
    });

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
        <div>
            <h2>{{ modalMessage[props.segment] }}</h2>
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

        border: none;
        border-radius: var(--border-radius);

        background-color: var(--clr-white);
    }
</style>
