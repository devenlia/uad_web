<!-- Copyright (C) 2023 Jannis Machowetz -->
<script lang="ts">
	import { Action, Parent, Visible } from '../store';
	import { onMount } from 'svelte';
	import { closeContentWizard } from '../';
	import { invalidateAll } from '$app/navigation';
	import { addToast } from '$lib/stores/toastStore';
	import { throwError } from '$lib/utils';
	import type { Category, Page } from '$lib/types';
	import { CategoryForm, ContainerForm } from '$lib/components/forms';
	import { CategoryCreation } from '$lib/modals/creation/components/index';

	const loadParents = async (): Promise<Array<Page> | null> => {
		let res: Response = await fetch(`/get?type=list`);

		if (res.status != 200) {
			await closeContentWizard();
			throwError(res.status, await res.text());
			return null;
		}

		let pages = await res.json();
		preselectedParent = pages.find((obj: any) => obj.id === preselectedParent.id);
		preselectedContainer = preselectedParent.containers.find((obj: any) => obj.id === preselectedContainer.id) ?? preselectedParent.containers[0];

		return pages;
	};

	const addCategory = async (category: Category) => {
		const formData = new FormData();
		formData.append('type', 'category');
		formData.append('parentID', category.parentId);
		formData.append('name', category.name);

		await fetch('/?/add', { method: 'POST', body: formData });

		await invalidateAll();
		await closeContentWizard();
	};

	let preselectedParent = $Parent.page;
	let preselectedContainer = $Parent.container;
</script>

<CategoryForm on:proceed={(e) => addCategory(e.detail.category)} possiblePages={loadParents()} bind:selectedPage={preselectedParent} bind:selectedContainer={preselectedContainer} />
