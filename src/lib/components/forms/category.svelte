<!-- Copyright (C) 2023 Jannis Machowetz -->
<script lang="ts">
	import { closeContentWizard } from '$lib/modals/creation/index.js';
	import { Action, Visible } from '$lib/modals/creation/store.js';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { Category, Container, Page } from '$lib/types';
	import { ActionButtons, Input, Select } from '$lib/components/forms/elements';

	export let possiblePages: Promise<Array<Page> | null> | null;
	export let selectedPage: Page;
	export let selectedContainer: Container;

	const formatPageOptionText = (option: Page) => {
		return option.name + ' (' + option.path.replaceAll('.', ' > ') + ')';
	};

	const formatContainerOptionText = (option: Page) => {
		return option.name;
	};

	const validateForm = () => {
		if (!selectedPage) {
			parentPageInvalid = { true: true, errorMessage: 'No page selected! Dafug??' };
			return false;
		}
		parentPageInvalid = { true: false, errorMessage: '' };

		if (!selectedContainer) {
			parentContainerInvalid = { true: true, errorMessage: 'No container selected!' };
			return false;
		}
		parentContainerInvalid = { true: false, errorMessage: '' };

		categoryName = categoryName?.trim();
		if (categoryName == '') {
			nameInvalid = { true: true, errorMessage: 'Supply a name!' };
			return false;
		}

		nameInvalid = { true: false, errorMessage: '' };
		return true;
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		if ($Visible && $Action == 'category' && event.key === 'Enter') {
			proceed();
		}
	};

	const onParentChange = () => {
		selectedContainer = selectedPage.containers[0];
	};

	onMount(() => {
		window.addEventListener('keydown', handleKeyDown);
		ref.focus();
		return () => window.removeEventListener('keydown', handleKeyDown);
	});

	const proceed = async () => {
		if (validateForm()) {
			dispatch('proceed', { category: { name: categoryName, parentId: selectedContainer!.id } });
		}
	};

	const dispatch = createEventDispatcher();

	$: parentPageLabels = ['Select the <b>parent page</b> of your new category:', '', '', `${parentPageInvalid.true ? parentPageInvalid.errorMessage : ''}`];
	$: parentContainerLabels = ['Select the <b>parent container</b> of your new category:', '', '', `${parentContainerInvalid.true ? parentContainerInvalid.errorMessage : ''}`];
	$: nameLabels = ['Give your container a <b>name</b>:', '', '', `${nameInvalid.true ? nameInvalid.errorMessage : ''}`];

	let parentPageInvalid = { true: false, errorMessage: '' };
	let parentContainerInvalid = { true: false, errorMessage: '' };

	let categoryName: string = '';

	let nameInvalid = { true: false, errorMessage: '' };

	let ref: any;
</script>

<div class="w-full">
	{#if possiblePages != null}
		{#await possiblePages}
			<Select bind:selectedValue={selectedPage} options={[selectedPage]} optionTextFormatter={formatPageOptionText} name="parentPage" labels={parentPageLabels} disabled={true} />
		{:then values}
			{#if values}
				<Select
					on:change={onParentChange}
					bind:selectedValue={selectedPage}
					options={values}
					optionTextFormatter={formatPageOptionText}
					name="parentPage"
					labels={parentPageLabels}
					disabled={values.length <= 1}
					invalid={parentPageInvalid.true}
				/>
			{/if}
		{/await}
	{/if}

	<Select
		bind:selectedValue={selectedContainer}
		options={selectedPage.containers}
		optionTextFormatter={formatContainerOptionText}
		name="parentContainer"
		labels={parentContainerLabels}
		disabled={selectedPage.containers.length <= 1}
		invalid={parentContainerInvalid.true}
	/>

	<Input bind:ref bind:value={categoryName} name="name" labels={nameLabels} invalid={nameInvalid.true} />

	<ActionButtons proceedText="Save" abortText="Discard" on:proceed={proceed} on:abort={closeContentWizard} />
</div>
