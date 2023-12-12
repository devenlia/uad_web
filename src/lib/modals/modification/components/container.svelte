<!-- Copyright (C) 2023 Jannis Machowetz -->
<script lang="ts">
	import { ContainerForm, PageForm } from '$lib/components/forms';
	import type { Category, Container, Link, Page } from '$lib/types';
	import { closeModificationModal, Parent } from '$lib/modals/modification';
	import { goto, invalidateAll } from '$app/navigation';

	export let Container: Page | Container | Category | Link | null;
	const container = Container as Container;

	const updateContainer = async (updatedContainer: Container) => {
		updatedContainer.id = container.id;
		updatedContainer.categories = container.categories;

		const formData = new FormData();
		formData.append('type', 'container');
		formData.append('object', JSON.stringify(updatedContainer));

		await fetch('/?/update', { method: 'POST', body: formData });

		await invalidateAll();
		await closeModificationModal();
	};

	let preselectedParent = Parent?.page ?? null;
</script>

<ContainerForm on:proceed={(e) => updateContainer(e.detail.container)} on:abort={closeModificationModal} selectedParent={preselectedParent} {container} />
