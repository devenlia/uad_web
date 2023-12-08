<!-- Copyright (C) 2023 Jannis Machowetz -->
<script lang="ts">
	import { closeContentWizard } from '../';
	import { invalidateAll } from '$app/navigation';
	import { throwError } from '$lib/utils';
	import { PageForm } from '$lib/components/forms';
	import type { Page } from '$lib/types';
	import { Parent } from '$lib/modals/creation/store';

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

	const addPage = async (page: Page) => {
		const formData = new FormData();
		formData.append('type', 'page');
		formData.append('name', page.name);
		formData.append('path', page.path);

		await fetch('/?/add', { method: 'POST', body: formData });

		await invalidateAll();
		await closeContentWizard();
	};

	let preselectedParent: Page = $Parent.page ?? { id: '0', name: 'Home', path: 'home', containers: [], subpages: [] };
</script>

<PageForm on:proceed={(e) => addPage(e.detail.page)} possibleParents={loadParents()} bind:selectedParent={preselectedParent} />
