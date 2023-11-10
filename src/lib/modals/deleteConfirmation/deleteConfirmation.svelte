<script lang="ts">
	import { DelVisible } from './store';
	import { onMount } from 'svelte';
	import { closeDeleteConfirmation } from './index';

	let visible: boolean;
	DelVisible.subscribe((v) => {
		visible = v;
	});

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

<div class="modal" class:modal-open={visible}>
	<div class="modal-box w-screen">
		<h3 class="font-bold text-3xl text-center">Are you sure about that?</h3>
		<div class="modal-action w-full">
			<button on:click={() => closeDeleteConfirmation(false)} class="btn btn-outline w-1/2">Cancel</button>
			<button on:click={() => closeDeleteConfirmation(true)} class="btn btn-error w-1/2">Delete</button>
		</div>
	</div>
</div>
