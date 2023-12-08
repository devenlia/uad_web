<!-- Copyright (C) 2023 Jannis Machowetz -->
<script lang="ts">
	import type { Container } from '$lib/types';
	import { Category, List } from '$lib/components/index';
	import IconParkOutlineMore from 'virtual:icons/icon-park-outline/more-one';
	import IconParkOutlinePlus from 'virtual:icons/icon-park-outline/plus';
	import { openDeleteConfirmation } from '$lib/modals/deletion';
	import IconParkOutlineDelete from 'virtual:icons/icon-park-outline/delete';
	import { invalidateAll } from '$app/navigation';
	import { openContentWizard } from '$lib/modals/creation';

	export let container: Container;

	const deleteContainer = async () => {
		const formData = new FormData();
		formData.append('type', 'container');
		formData.append('id', container.id);

		await fetch('/?/delete', { method: 'POST', body: formData });
		await invalidateAll();
	};

	$: items = container.categories.sort((a, b) => a.sortIndex - b.sortIndex);

	const onCategoryDrop = async (droppedCategories: any) => {
		for (const category of droppedCategories) {
			category.sortIndex = droppedCategories.indexOf(category);
			category.parentId = container.id;

			const formData = new FormData();
			formData.append('type', 'category');
			formData.append('object', JSON.stringify(category));

			await fetch('/?/update', { method: 'POST', body: formData });
		}

		container.categories = droppedCategories;

		const formData = new FormData();
		formData.append('type', 'container');
		formData.append('object', JSON.stringify(container));

		await fetch('/?/update', { method: 'POST', body: formData });

		items = droppedCategories;
	};
</script>

<div class="mt-5 border-2 border-gray-400 rounded-box w-full">
	<div class="text-2xl bg-base-100 relative w-max px-3 py-1 rounded-box flex flex-row group" style="top: -20px; left: 20px">
		<h1>{container.name}</h1>
		<div class="tooltip tooltip-bottom" data-tip="Add a new category">
			<button class="ml-2 btn btn-square btn-ghost btn-sm text-lg" on:click={() => openContentWizard('category', null, container.id)}><IconParkOutlinePlus /></button>
		</div>
		<div class="tooltip tooltip-bottom" data-tip="Delete this container">
			<button class="ml-1 btn btn-square btn-ghost btn-sm hover:text-error" on:click={() => openDeleteConfirmation(deleteContainer)}><IconParkOutlineDelete /></button>
		</div>
	</div>

	<div class="px-3">
		<List {items} itemComponent={Category} onDrop={onCategoryDrop}>
			<div class="text-center w-full pb-3">
				<button on:click={() => openContentWizard('category', null, container.id)} class="btn btn-outline btn-sm">Add a new category,</button> or drag and drop one here.
			</div>
		</List>
	</div>
</div>
