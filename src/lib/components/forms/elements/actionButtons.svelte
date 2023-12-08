<!-- Copyright (C) 2023 Jannis Machowetz -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let proceedText: String;
	export let abortText: String;

	const dispatch = createEventDispatcher();
</script>

<div class="flex flex-row justify-end gap-2">
	<button on:click={() => dispatch('abort')} class="btn btn-outline">{@html abortText}</button>
	<button on:click={() => dispatch('proceed')} class="btn btn-primary">{@html proceedText}</button>
</div>
