<!-- Copyright (C) 2023 Jannis Machowetz -->
<script lang="ts">
	import { Visible } from './store';
	import { onMount } from 'svelte';
	import { closeDeleteConfirmation, Message, Type } from './';

	let visible: boolean;

	onMount(() => {
		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	});

	const handleKeyDown = (event: KeyboardEvent) => {
		if (visible && event.key === 'Escape') {
			closeDeleteConfirmation(false);
		}
	};
</script>

<div class="modal" class:modal-open={$Visible}>
	<div class="modal-box w-screen">
		{#key $Visible}
			<h3 class="font-bold text-2xl text-center">Are you sure you want to delete this {Type}</h3>
		{/key}
		<div class="divider" />
		{#key $Visible}
			{@html Message}
		{/key}
		<div class="divider" />
		<div class="modal-action w-full">
			<button on:click={() => closeDeleteConfirmation(false)} class="btn btn-outline w-1/2">Cancel</button>
			<button on:click={() => closeDeleteConfirmation(true)} class="btn btn-error w-1/2">Delete</button>
		</div>
	</div>
</div>
