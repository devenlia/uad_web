<!-- Copyright (C) 2023 Jannis Machowetz -->
<script lang="ts">
	import { CategoryForm, ContainerForm, PageForm } from '$lib/components/forms';
	import type { Category, Container, Link, Page } from '$lib/types';
	import { closeModificationModal, Parent } from '$lib/modals/modification';
	import { goto, invalidateAll } from '$app/navigation';
	import { homePageDummy } from '$lib/utils';

	export let Category : Page | Container | Category | Link | null;
	const category = Category as Category

	const updateCategory = async (updatedCategory: Category) => {
		updatedCategory.id = category.id
		updatedCategory.links = category.links;

		const formData = new FormData();
		formData.append('type', 'category');
		formData.append('object', JSON.stringify(updatedCategory));

		await fetch('/?/update', { method: 'POST', body: formData });

		await invalidateAll();
		await closeModificationModal();
	};

	let preselectedPage = Parent?.page ?? homePageDummy;
	let preselectedContainer = Parent?.container ?? null
</script>

<CategoryForm on:proceed={(e) => updateCategory(e.detail.category)} on:abort={closeModificationModal} selectedPage={preselectedPage} selectedContainer={preselectedContainer} category={category}/>