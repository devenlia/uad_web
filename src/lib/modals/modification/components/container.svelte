<!-- Copyright (C) 2023 Jannis Machowetz -->
<script lang="ts">
	import { ContainerForm, PageForm } from '$lib/components/forms';
	import type { Container } from '$lib/types';
	import { closeModificationModal, Parent } from '$lib/modals/modification';
	import { goto, invalidateAll } from '$app/navigation';

	export let Container : Container;

	const updateContainer = async (container: Container) => {
		container.id = Container!.id
		container.categories = Container!.categories;

		const formData = new FormData();
		formData.append('type', 'container');
		formData.append('object', JSON.stringify(container));

		await fetch('/?/update', { method: 'POST', body: formData });

		await invalidateAll();
		await closeModificationModal();
	};

	let preselectedParent = Parent?.page ?? null;
</script>

<ContainerForm on:proceed={(e) => updateContainer(e.detail.container)} on:abort={closeModificationModal} selectedParent={preselectedParent} container={Container}/>
