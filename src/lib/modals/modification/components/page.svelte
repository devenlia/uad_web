<!-- Copyright (C) 2023 Jannis Machowetz -->
<script lang="ts">
	import { PageForm } from '$lib/components/forms';
	import { closeContentWizard } from '$lib/modals/creation';
	import { throwError } from '$lib/utils';
	import type { Category, Container, Link, Page } from '$lib/types';
	import { closeModificationModal, Parent } from '$lib/modals/modification';
	import { goto, invalidateAll } from '$app/navigation';

	export let Page: Page | Container | Category | Link | null;
	const page = Page as Page;

	const updatePage = async (updatedPage: Page) => {
		updatedPage.id = page.id;
		updatedPage.containers = page.containers;
		updatedPage.subpages = page.subpages;

		const formData = new FormData();
		formData.append('type', 'page');
		formData.append('object', JSON.stringify(updatedPage));

		await fetch('/?/update', { method: 'POST', body: formData });

		await goto('/' + updatedPage.path.replaceAll('.', '/'));
		await closeModificationModal();
	};

	let preselectedParent = Parent?.page ?? null;
</script>

<PageForm on:proceed={(e) => updatePage(e.detail.page)} on:abort={closeModificationModal} selectedParent={preselectedParent} {page} />
