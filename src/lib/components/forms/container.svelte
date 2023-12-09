<!-- Copyright (C) 2023 Jannis Machowetz -->
<script lang="ts">
	import { closeContentWizard } from '$lib/modals/creation/index.js';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { Page } from '$lib/types.js';
	import { ActionButtons, Input, Select } from '$lib/components/forms/elements';

	export let possibleParents: Promise<Array<Page> | null> | null;
	export let selectedParent: Page;

	const validateForm = () => {
		if (!selectedParent) {
			parentInvalid = { true: true, errorMessage: 'No page selected! Dafug??' };
			return false;
		}

		containerName = containerName?.trim();
		if (!containerName || containerName === '') {
			nameInvalid = { true: true, errorMessage: 'Supply a name!' };
			return false;
		}

		nameInvalid = { true: false, errorMessage: '' };
		return true;
	};

	const proceed = async () => {
		if (validateForm()) {
			dispatch('proceed', { container: { name: containerName, parentId: selectedParent.id } });
		}
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			proceed();
		}
	};

	const formatOptionText = (option: Page) => {
		return option.name + ' (' + option.path.replaceAll('.', ' > ') + ')';
	};

	onMount(() => {
		window.addEventListener('keydown', handleKeyDown);
		ref.focus();
		return () => window.removeEventListener('keydown', handleKeyDown);
	});

	const dispatch = createEventDispatcher();

	$: parentLabels = ['Select the <b>parent</b> of your new container:', '', '', `${parentInvalid.true ? parentInvalid.errorMessage : ''}`];
	$: nameLabels = ['Give your container a <b>name</b>:', '', '', `${nameInvalid.true ? nameInvalid.errorMessage : ''}`];

	let parentInvalid = { true: false, errorMessage: '' };

	let containerName: string = '';

	let nameInvalid = { true: false, errorMessage: '' };

	let ref: any;
</script>

<div class="w-full">
	{#if possibleParents != null}
		{#await possibleParents}
			<Select bind:selectedValue={selectedParent} options={[selectedParent]} optionTextFormatter={formatOptionText} name="parentPage" labels={parentLabels} disabled={true} />
		{:then values}
			{#if values}
				<Select
					bind:selectedValue={selectedParent}
					options={values}
					optionTextFormatter={formatOptionText}
					name="parentPage"
					labels={parentLabels}
					disabled={values.length <= 1}
					invalid={parentInvalid.true}
				/>
			{/if}
		{/await}
	{/if}

	<Input bind:ref bind:value={containerName} name="name" labels={nameLabels} invalid={nameInvalid.true} />

	<ActionButtons proceedText="Save" abortText="Discard" on:proceed={proceed} on:abort={closeContentWizard} />
</div>
