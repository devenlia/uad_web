<!-- Copyright (C) 2023 Jannis Machowetz -->
<script lang="ts">
	import { Action, Parent, Visible } from '../store';
	import { onMount } from 'svelte';
	import { closeContentWizard } from '../';
	import { invalidateAll } from '$app/navigation';
	import { addToast } from '$lib/stores/toastStore';
	import { throwError } from '$lib/utils';
	import type { Container, Page } from '$lib/types';
	import { ContainerForm, PageForm } from '$lib/components/forms';

	const loadParents = async (): Promise<Array<Page> | null> => {
		let res: Response = await fetch(`/get?type=list`);

		if (res.status != 200) {
			await closeContentWizard();
			throwError(res.status, await res.text());
			return null;
		}

		let pages = await res.json();
		preselectedParent = pages.find((obj: any) => obj.id === (preselectedParent ? preselectedParent.id : '0'));

		return pages;
	};

	const addContainer = async (container: Container) => {
		const formData = new FormData();
		formData.append('type', 'container');
		formData.append('name', container.name);
		formData.append('parentID', container.parentId);

		await fetch('/?/add', { method: 'POST', body: formData });

		await invalidateAll();
		await closeContentWizard();
	};

	let preselectedParent: Page = $Parent.page ?? { id: '0', name: 'Home', path: 'home', containers: [], subpages: [] };
</script>

<ContainerForm on:proceed={(e) => addContainer(e.detail.container)} possibleParents={loadParents()} bind:selectedParent={preselectedParent} />
