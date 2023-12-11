<script lang="ts">
	import { onMount } from 'svelte';
	import { closeModificationModal, Element, Type } from '.';
	import { Visible } from './store';
	import IconParkOutlineClose from 'virtual:icons/icon-park-outline/close';
	import {
		CategoryModification,
		ContainerModification,
		LinkModification,
		PageModification
	} from '$lib/modals/modification/components';
	import type { Page } from '$lib/types';

	onMount(() => {
		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	});

	const handleKeyDown = (event: KeyboardEvent) => {
		if ($Visible && event.key === 'Escape') {
			closeModificationModal();
		}
	};
</script>

{#key $Visible}
	<div class="modal" class:modal-open={$Visible}>
		<div class="modal-box w-screen">
			<div class="flex flex-row justify-between align-middle h-8">
				<h1 class="text-lg">
					Edit
				</h1>
				<div class="flex flex-row justify-between align-middle gap-1.5">
					<button on:click={closeModificationModal} class="btn btn-sm btn-ghost btn-square"><IconParkOutlineClose /></button>
				</div>
			</div>

			<div class="divider my-0" />

			<div class="overflow-y-auto overflow-x-visible px-3" style="max-height: calc(100vh - 5em - 96px);">
				{#if Type === 'page'}
					<PageModification Page={Element}/>
				{:else if Type === 'container'}
					<ContainerModification />
				{:else if Type === 'category'}
					<CategoryModification />
				{:else if Type === 'link'}
					<LinkModification />
				{/if}
			</div>
		</div>
	</div>
{/key}