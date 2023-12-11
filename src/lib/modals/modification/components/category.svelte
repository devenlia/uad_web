<!-- Copyright (C) 2023 Jannis Machowetz -->
<script lang="ts">
	import { CategoryForm, ContainerForm, PageForm } from '$lib/components/forms';
	import type { Category } from '$lib/types';
	import { closeModificationModal, Parent } from '$lib/modals/modification';
	import { goto, invalidateAll } from '$app/navigation';
	import { homePageDummy } from '$lib/utils';

	export let Category : Category;

	const updateCategory = async (category: Category) => {
		category.id = Category!.id
		category.links = Category!.links;

		const formData = new FormData();
		formData.append('type', 'category');
		formData.append('object', JSON.stringify(category));

		await fetch('/?/update', { method: 'POST', body: formData });

		await invalidateAll();
		await closeModificationModal();
	};

	let preselectedPage = Parent?.page ?? homePageDummy;
	let preselectedContainer = Parent?.container ?? null
</script>

<CategoryForm on:proceed={(e) => updateCategory(e.detail.category)} on:abort={closeModificationModal} selectedPage={preselectedPage} selectedContainer={preselectedContainer} category={Category}/>