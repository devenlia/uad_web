<script lang="ts">
	import { PageForm } from '$lib/components/forms';
	import { closeContentWizard } from '$lib/modals/creation';
	import { throwError } from '$lib/utils';
	import type { Category, Container, Link, Page } from '$lib/types';
	import { closeModificationModal, Parent } from '$lib/modals/modification';
	import { goto, invalidateAll } from '$app/navigation';

	export let Page : Page;

	const updatePage = async (page: Page) => {
		page.id = Page!.id
		page.containers = Page!.containers;
		page.subpages = Page!.subpages;

		const formData = new FormData();
		formData.append('type', 'page');
		formData.append('object', JSON.stringify(page));

		await fetch('/?/update', { method: 'POST', body: formData });

		await goto('/' + page.path.replaceAll('.', '/'));
		await closeModificationModal();
	};

	let preselectedParent = Parent?.page ?? null;
</script>

<PageForm on:proceed={(e) => updatePage(e.detail.page)} on:abort={closeModificationModal} selectedParent={preselectedParent} page={Page}/>
