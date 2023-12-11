<!-- Copyright (C) 2023 Jannis Machowetz -->
<script lang="ts">
	import { closeContentWizard } from '../';
	import { invalidateAll } from '$app/navigation';
	import { throwError } from '$lib/utils';
	import { PageForm } from '$lib/components/forms';
	import type { Page } from '$lib/types';
	import { Parent } from '$lib/modals/creation/store';



	const addPage = async (page: Page) => {
		const formData = new FormData();
		formData.append('type', 'page');
		formData.append('name', page.name);
		formData.append('path', page.path);

		await fetch('/?/add', { method: 'POST', body: formData });

		await invalidateAll();
		await closeContentWizard();
	};

	let preselectedParent: Page = $Parent.page;
</script>

<PageForm on:proceed={(e) => addPage(e.detail.page)} on:abort={closeContentWizard} selectedParent={preselectedParent} />
