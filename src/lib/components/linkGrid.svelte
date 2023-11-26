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

<section class="w-full flex flex-wrap p-1 gap-3" use:dndzone={({items: itemsData, flipDurationMs: 300, type: 'link', dropTargetClasses: ['border', 'border-accent', 'rounded-btn'], dropTargetStyle: {}, centreDraggedOnCursor: true})} on:consider={handleConsider} on:finalize={handleFinalize}>
	{#each itemsData as item (item.id)}
		<div animate:flip={({duration: 300})} class="flex-auto min-w-max">
			<button class="btn w-full h-full flex justify-between {editMode ? 'bg-base-300 hover:text-error' : 'btn-primary'}" on:click={() => {if (editMode) openDeleteConfirmation(() => deleteLink(item)); else window.open(item.href?.toString() ?? '/', "_blank")}}>
				<span/>
				{item.name}
				{#if editMode}
					<IconParkOutlineDelete/>
				{:else}
					<span/>
				{/if}
			</button>
		</div>
	{/each}
</section>