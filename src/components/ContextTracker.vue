<script setup lang="ts"></script>
<template>
    <div class="context-container">
        <input type="text" name="" id="" />
        <button>
            <i class="bi bi-plus-circle"></i>
        </button>
    </div>
</template>
<style lang="css" scoped>
    .context-container {
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
