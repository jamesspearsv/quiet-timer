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
        if (actionModel.value && typeof actionModel.value === 'string') {
            emit('addContext', {
                action: actionModel.value,
                completed: false,
                duration_worked: 0,
            });
            actionModel.value = '';
        }
    }
</script>
<template>
    <template v-if="context">
        <div class="context-action">
            <p>{{ context.action }}</p>
            <button>
                <i class="bi bi-check2"></i>
            </button>
        </div>
    </template>
    <template v-else>
        <form @submit.prevent="addAction">
            <input
                type="text"
                placeholder="What are you doing?"
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
    .context-action {
        display: flex;
        align-items: center;
        gap: 1rem;

        p {
            font-size: 1.5rem;
        }
    }

    form {
        width: 100%;
        display: flex;
        gap: 0;

        --border-style: solid 1px var(--clr-black);

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
    }
</style>
