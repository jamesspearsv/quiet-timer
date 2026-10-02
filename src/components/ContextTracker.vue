<script setup lang="ts">
    import type { Context } from '@/lib/types';

    const { context } = defineProps<{
        context: Context | undefined;
    }>();

    const emit = defineEmits<{
        addContext: [c: Context];
    }>();

    const actionModel = defineModel();

    function addAction() {
        if (actionModel.value) {
            alert(`Adding action: ${actionModel.value}`);
            emit('addContext', {
                action: actionModel.value, // todo: fix this error
                completed: false,
                duration_worked: 0,
            });
            actionModel.value = '';
        }
    }
</script>
<template>
    <template v-if="context">
        <p>{{ context.action }}</p>
    </template>
    <template v-else>
        <form class="context-input" @submit.prevent="addAction">
            <input
                type="text"
                v-model.trim="actionModel"
                name="action"
                id="action"
            />
            <button type="submit">
                <i class="bi bi-plus-circle-fill"></i>
            </button>
        </form>
    </template>
</template>
<style lang="css" scoped>
    .context-input {
        width: 100%;
        display: flex;
        gap: 0;

        --border-style: solid 1px var(--clr-black);
    }

    input {
        padding: 0.5rem;
        font-size: 1.25rem;
        font-family: inherit;
        flex: 1;

        border-radius: var(--border-radius);
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border: var(--border-style);
    }

    button {
        font-size: 1.25rem;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border: var(--border-style);
        padding: 1rem;
    }
</style>
