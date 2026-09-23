<script setup>
    import { useTemplateRef, watch } from 'vue';

    const props = defineProps({
        open: {
            type: Boolean,
            required: true,
        },
    });

    const dialog = useTemplateRef('dialog');

    watch(
        () => props.open,
        () => {
            if (props.open) {
                dialog.value.showModal();
            } else {
                dialog.value.close();
            }
        },
    );
</script>

<template>
    <dialog ref="dialog"></dialog>
</template>

<style scoped>
    dialog {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;

        background-color: black;
    }
</style>
