<!-- Copyright (C) 2023 Jannis Machowetz -->
<script lang="ts">
	import type { Category } from '$lib/types';
	import { openContentWizard } from '../modals/contentWizard';
	import IconParkOutlineDelete from 'virtual:icons/icon-park-outline/delete';
	import { openDeleteConfirmation } from '../modals/deleteConfirmation';
	import { invalidateAll } from '$app/navigation';
	import { Grid, Link } from '$lib/components';

	export let category: Category;

	const deleteCategory = async () => {
		const formData = new FormData();
		formData.append('type', 'category');
		formData.append('id', category.id);

		await fetch('/?/delete', { method: 'POST', body: formData });
		await invalidateAll();
	};

	let items = category.links;
	const onLinkDrop = (newItems : any) => {
 		items = newItems;
	}
</script>

<div class="collapse bg-base-200 mb-3 w-full {category.links.length > 0 ? 'collapse-arrow' : 'collapse-close'}">
	<input type="checkbox" />
	<div class="collapse-title text-xl font-medium flex flex-row justify-between">
		{category.name}

		{#if category.links.length === 0}
			<div class="flex content-center gap-x-1 relative" style="right: -30px">
				<button class="btn btn-sm btn-outline z-50" on:click={() => openContentWizard('link', null, category.id)}>Add a link!</button>
				<button class="btn btn-sm btn-outline btn-square hover:btn-error z-50" on:click={() => openDeleteConfirmation(deleteCategory)}><IconParkOutlineDelete /></button>
			</div>
		{:else}
			<button class="btn btn-sm btn-square z-50" on:click={() => openDeleteConfirmation(deleteCategory)}><IconParkOutlineDelete /></button>
		{/if}
	</div>
	<div class="collapse-content w-full">
		<div class="w-full max-w-full">
			<Grid itemsData={items} itemComponent={Link} onDrop={onLinkDrop}/>
		</div>
	</div>
</div>
