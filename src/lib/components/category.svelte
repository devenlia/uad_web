<!-- Copyright (C) 2023 Jannis Machowetz -->
<script lang="ts">
	import type { Category } from '$lib/types';
	import { openContentWizard } from '../modals/creation';
	import IconParkOutlineDelete from 'virtual:icons/icon-park-outline/delete';
	import IconParkOutlineDrag from 'virtual:icons/icon-park-outline/drag';
	import IconParkOutlineEdit from 'virtual:icons/icon-park-outline/edit-two';
	import IconParkOutlineCheck from 'virtual:icons/icon-park-outline/check';
	import IconParkOutlinePlus from 'virtual:icons/icon-park-outline/plus';
	import { openDeleteConfirmation } from '../modals/deletion';
	import { invalidateAll } from '$app/navigation';
	import { LinkGrid } from '$lib/components';

	export let item: Category;

	let editMode: boolean;

	const deleteCategory = async () => {
		const formData = new FormData();
		formData.append('type', 'category');
		formData.append('id', item.id);

		await fetch('/?/delete', { method: 'POST', body: formData });
		await invalidateAll();
	};

	$: items = item.links.sort((a, b) => a.sortIndex - b.sortIndex);
	$: editMode = items.length == 0 ? false : editMode;

	const onLinkDrop = async (droppedLinks: any) => {
		for (const link of droppedLinks) {
			link.sortIndex = droppedLinks.indexOf(link);
			link.parentId = item.id;

			const formData = new FormData();
			formData.append('type', 'link');
			formData.append('object', JSON.stringify(link));

			await fetch('/?/update', { method: 'POST', body: formData });
		}

		item.links = droppedLinks;

		const formData = new FormData();
		formData.append('type', 'category');
		formData.append('object', JSON.stringify(item));

		await fetch('/?/update', { method: 'POST', body: formData });

		items = droppedLinks;
	};
</script>

<div class="collapse bg-base-200 mb-3 w-full {item.links.length > 0 ? 'collapse-open' : 'collapse-close'}">
	<input type="checkbox" class="peer" />
	<div class="collapse-title text-xl font-medium flex flex-row justify-between">
		<div class="flex flex-row items-center gap-3">
			<div class="h-min text-sm z-[50] cursor-move">
				<!--on:mousedown={onStartDrag}-->
				<IconParkOutlineDrag />
			</div>
			{item.name}
		</div>

		{#if item.links.length === 0}
			<div class="flex content-center gap-x-1 relative" style="right: -30px">
				<button class="btn btn-sm btn-outline z-50" on:click={() => openContentWizard('link', null, item.id)}>Add a link!</button>
				<button class="btn btn-sm btn-outline btn-square hover:btn-error z-50" on:click={() => openDeleteConfirmation(deleteCategory)}><IconParkOutlineDelete /></button>
			</div>
		{:else}
			<div class="z-50 relative" style="right: -30px">
				<div class="tooltip tooltip-left" data-tip="Delete this category">
					<button class="btn btn-sm btn-square" on:click={() => openDeleteConfirmation(deleteCategory)}><IconParkOutlineDelete /></button>
				</div>
				<div class="tooltip tooltip-left" data-tip="Modify the links in this category.">
					<button class="btn btn-sm btn-square" on:click={() => (editMode = !editMode)}>
						{#if editMode}
							<IconParkOutlineCheck />
						{:else}
							<IconParkOutlineEdit />
						{/if}
					</button>
				</div>
				<div class="tooltip tooltip-left" data-tip="Add a link to this category">
					<button class="btn btn-sm btn-square" on:click={() => openContentWizard('link', null, item.id)}><IconParkOutlinePlus /></button>
				</div>
			</div>
		{/if}
	</div>
	<div class="collapse-content w-full">
		<div class="w-full max-w-full">
			<LinkGrid itemsData={items} onDrop={onLinkDrop} {editMode} />
		</div>
	</div>
</div>
