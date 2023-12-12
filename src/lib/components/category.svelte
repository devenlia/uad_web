<!-- Copyright (C) 2023 Jannis Machowetz -->
<script lang="ts">
	import type { Category } from '$lib/types';
	import { openContentWizard } from '../modals/creation';
	import IconParkOutlineDelete from 'virtual:icons/icon-park-outline/delete';
	import IconParkOutlineDrag from 'virtual:icons/icon-park-outline/drag';
	import IconParkOutlineEdit from 'virtual:icons/icon-park-outline/edit-two';
	import IconParkOutlineEditTwo from 'virtual:icons/icon-park-outline/edit-one';
	import IconParkOutlineCheck from 'virtual:icons/icon-park-outline/check';
	import IconParkOutlinePlus from 'virtual:icons/icon-park-outline/plus';
	import { openDeleteConfirmation } from '../modals/deletion';
	import { invalidateAll } from '$app/navigation';
	import { LinkGrid } from '$lib/components';
	import IconParkOutlineMore from 'virtual:icons/icon-park-outline/more-one';
	import { openModificationModal } from '$lib/modals/modification';

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
			<div class="h-min text-sm z-[1] cursor-move">
				<!--on:mousedown={onStartDrag}-->
				<IconParkOutlineDrag />
			</div>
			{item.name}
		</div>

		{#if item.links.length === 0}
			<div class="flex content-center gap-x-1 relative" style="right: -30px">
				<button class="btn btn-sm btn-outline z-50" on:click={() => openContentWizard('link', null, item.id)}>Add a link!</button>
				<button class="btn btn-sm btn-outline z-50" on:click={() => openModificationModal('category', item)}>Edit!</button>
				<button
					class="btn btn-sm btn-outline btn-square hover:btn-error z-50"
					on:click={() =>
						openDeleteConfirmation(deleteCategory, 'Category', `Please note, you are about to delete the category '${item.name}' along with all of its content.<br/> This action cannot be undone!`)}
					><IconParkOutlineDelete /></button
				>
			</div>
		{:else}
			<div class="z-50 relative flex justify-end items-center gap-1" style="right: -30px">
				{#if editMode}
					<div class="tooltip tooltip-left" data-tip="Apply">
						<button class="btn btn-sm btn-square" on:click={() => (editMode = false)}>
							<IconParkOutlineCheck />
						</button>
					</div>
				{:else}
					<div class="tooltip tooltip-left" data-tip="Enable link-editing mode">
						<button class="btn btn-sm btn-square btn-ghost" on:click={() => (editMode = true)}>
							<IconParkOutlineEdit />
						</button>
					</div>
					<div class="dropdown dropdown-left">
						<div tabindex="0" role="button" class="btn btn-sm btn-square btn-ghost text-lg"><IconParkOutlineMore /></div>
						<ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-300 rounded-box w-max" style="top: -5px">
							<li>
								<button on:click={() => openContentWizard('link', null, item.id)}>
									<IconParkOutlinePlus />
									<span>Add a link to this category</span>
								</button>
							</li>
							<li>
								<button on:click={() => openModificationModal('category', item)}>
									<IconParkOutlineEditTwo />
									<span>Edit this category</span>
								</button>
							</li>
							<li>
								<button
									on:click={() =>
										openDeleteConfirmation(
											deleteCategory,
											'Category',
											`Please note, you are about to delete the category '${item.name}' along with all of its content.<br/> This action cannot be undone!`
										)}
								>
									<IconParkOutlineDelete />
									<span>Delete this container</span>
								</button>
							</li>
						</ul>
					</div>
				{/if}
			</div>
		{/if}
	</div>
	<div class="collapse-content w-full">
		<div class="w-full max-w-full">
			<LinkGrid itemsData={items} onDrop={onLinkDrop} {editMode} />
		</div>
	</div>
</div>
