<!-- Copyright (C) 2023 Jannis Machowetz -->
<script lang="ts">
	import { Action, Parent, Visible } from '../store';
	import { onMount } from 'svelte';
	import { closeContentWizard } from '../';
	import { invalidateAll } from '$app/navigation';
	import { addToast } from '$lib/stores/toastStore';
	import validator from 'validator';
	import { throwError } from '$lib/utils';
	import { CategoryForm, LinkForm } from '$lib/components/forms';
	import type { Link } from '$lib/types';

	async function loadParents() {
		let res: Response = await fetch(`/get?type=list`);

		if (res.status != 200) {
			await closeContentWizard();
			throwError(res.status, await res.text());
			return null;
		}

		let pages = await res.json();
		preselectedParent = pages.find((obj: any) => obj.id === preselectedParent.id);
		preselectedContainer = preselectedParent.containers.find((obj: any) => obj.id === preselectedContainer.id) ?? preselectedParent.containers[0];
		preselectedCategory = preselectedContainer.categories.find((obj: any) => obj.id === preselectedContainer.id) ?? preselectedContainer.categories[0];

		return pages;
	}

	const addLink = async (link: Link) => {
		const formData = new FormData();
		formData.append('type', 'link');
		formData.append('name', link.name);
		formData.append('parentID', link.parentId);
		formData.append('href', link.href);

		await fetch('/?/add', { method: 'POST', body: formData });

		await invalidateAll();
		await closeContentWizard();
	};

	let preselectedParent = $Parent.page;
	let preselectedContainer = $Parent.container;
	let preselectedCategory = $Parent.category;
</script>

<LinkForm
	on:proceed={(e) => addLink(e.detail.link)}
	possiblePages={loadParents()}
	bind:selectedPage={preselectedParent}
	bind:selectedContainer={preselectedContainer}
	bind:selectedCategory={preselectedCategory}
/>
