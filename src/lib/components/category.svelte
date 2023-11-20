<!-- Copyright (C) 2023 Jannis Machowetz -->
<script lang="ts">
	import type { Category, Link } from '$lib/types';
	import { openContentWizard } from '../modals/contentWizard';
	import IconParkOutlineDelete from 'virtual:icons/icon-park-outline/delete';
	import { openDeleteConfirmation } from '../modals/deleteConfirmation';
	import { invalidateAll } from '$app/navigation';

	export let category: Category;

	const deleteCategory = async () => {
		const formData = new FormData();
		formData.append('type', 'category');
		formData.append('id', category.id);

		await fetch('/?/delete', { method: 'POST', body: formData });
		await invalidateAll();
	};
</script>

<div class="collapse bg-base-200 {category.links.length > 0 ? 'collapse-arrow' : 'collapse-close'}">
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
	<div class="collapse-content">
		<div class="grid grid-cols-8 gap-3">
			{#each category.links as link}
				{#if 'href' in link && 'name' in link}
					<a target="_blank" class="btn" href={link.href?.toString() ?? '/'}>{link.name}</a>
				{/if}
			{/each}
		</div>
	</div>
</div>
