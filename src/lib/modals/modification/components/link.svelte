<!-- Copyright (C) 2023 Jannis Machowetz -->
<script lang="ts">
	import { LinkForm } from '$lib/components/forms';
	import type { Category, Container, Link, Page } from '$lib/types';
	import { closeModificationModal, Parent } from '$lib/modals/modification';
	import { invalidateAll } from '$app/navigation';
	import { emptyDummyContainer, homePageDummy } from '$lib/utils';

	export let Link : Page | Container | Category | Link | null;
	const link = Link as Link

	const updateLink = async (updatedLink: Link) => {
		updatedLink.id = link.id

		const formData = new FormData();
		formData.append('type', 'link');
		formData.append('object', JSON.stringify(updatedLink));

		await fetch('/?/update', { method: 'POST', body: formData });

		await invalidateAll();
		await closeModificationModal();
	};

	let preselectedPage = Parent?.page ?? homePageDummy;
	let preselectedContainer = Parent?.container ?? emptyDummyContainer
	let preselectedCategory = Parent?.category ?? null
</script>

<LinkForm on:proceed={(e) => updateLink(e.detail.link)} on:abort={closeModificationModal} selectedPage={preselectedPage} selectedContainer={preselectedContainer} selectedCategory={preselectedCategory} link={link}/>