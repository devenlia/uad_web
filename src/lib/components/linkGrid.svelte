<!-- Copyright (C) 2023 Jannis Machowetz -->
<script lang="ts">
	import {dndzone} from 'svelte-dnd-action';
	import {flip} from 'svelte/animate';
	import { invalidateAll } from '$app/navigation';
	import { openDeleteConfirmation } from '$lib/modals/deleteConfirmation';
	import IconParkOutlineDelete from 'virtual:icons/icon-park-outline/delete';
	import type { Link } from '$lib/types';

	export let itemsData : Array<Link>;
	export let onDrop : any;
	export let editMode : boolean

	function handleConsider(e : any) {
		itemsData = e.detail.items;
	}

	function handleFinalize(e : any) {
		onDrop(e.detail.items);
	}

	const deleteLink = async (link: Link) => {
		const formData = new FormData();
		formData.append('type', 'link');
		formData.append('id', link.id);

		await fetch('/?/delete', { method: 'POST', body: formData });
		await invalidateAll();
	};
</script>

<section class="w-full flex items-stretch p-1 gap-3" use:dndzone={({items: itemsData, flipDurationMs: 300, type: 'link', dropTargetClasses: ['border', 'border-accent', 'rounded-btn'], dropTargetStyle: {}, centreDraggedOnCursor: true})} on:consider={handleConsider} on:finalize={handleFinalize}>
	{#each itemsData as item (item.id)}
		<div animate:flip={({duration: 300})} class="w-full">
			<div class="w-full flex gap-1 rounded-btn {editMode ? 'hover:outline outline-accent outline-1' : ''}">
				<button class="flex-auto btn btn-primary h-full {editMode ? 'btn-disabled' : ''}" on:click={() => window.open(item.href?.toString() ?? '/', '_blank')}>
					{item.name}
				</button>
				{#if editMode}
					<button class="btn btn-ghost h-full hover:text-error" on:click={() => openDeleteConfirmation(() => deleteLink(item))}>
						<IconParkOutlineDelete/>
					</button>
				{/if}
			</div>
		</div>
	{/each}
</section>