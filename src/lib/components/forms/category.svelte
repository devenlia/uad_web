<!-- Copyright (C) 2023 Jannis Machowetz -->
<script lang="ts">
	import { closeContentWizard } from '$lib/modals/creation/index.js';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { Category, Container, Page } from '$lib/types';
	import { ActionButtons, Input, Select } from '$lib/components/forms/elements';
	import { throwError } from '$lib/utils';

	export let category : Category | null = null
	export let selectedPage: Page;
	export let selectedContainer: Container | null | undefined;

	const loadParents = async (): Promise<Array<Page> | null> => {
		let res: Response = await fetch(`/get?type=list`);

		if (res.status != 200) {
			await closeContentWizard();
			throwError(res.status, await res.text());
			return null;
		}

		let pages = await res.json();
		selectedPage = pages.find((obj: any) => obj.id === selectedPage?.id);
		selectedContainer = selectedPage?.containers.find((obj: any) => obj.id === selectedContainer?.id) ?? selectedPage?.containers[0];

		return pages;
	};

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
		if (event.key === 'Enter') {
			proceed();
		}
	};

	const onParentChange = () => {
		selectedContainer = selectedPage!.containers[0];
	};

	onMount(() => {
		if (category) {
			categoryName = category.name
			edit = true
		}
		window.addEventListener('keydown', handleKeyDown);
		ref.focus();
		return () => window.removeEventListener('keydown', handleKeyDown);
	});

	const proceed = async () => {
		if (validateForm()) {
			dispatch('proceed', { category: {
				name: categoryName,
				parentId: selectedContainer!.id } });
		}
	};

	const abort = () => {
		dispatch('abort');
	}

	const dispatch = createEventDispatcher();

	$: parentPageLabels = [
		edit ? 'Select the new <b>parent page</b> of the category:' : 'Select the <b>parent page</b> of your new category:',
		'', '',
		`${parentPageInvalid.true ? parentPageInvalid.errorMessage : ''}`
	];
	$: parentContainerLabels = [
		edit ? 'Select the new <b>parent container</b> of the category:' : 'Select the <b>parent container</b> of your new category:',
		'', '',
		`${parentContainerInvalid.true ? parentContainerInvalid.errorMessage : ''}`
	];
	$: nameLabels = [
		edit ? 'Edit the <b>name</b> of the category:' : 'Give your category a <b>name</b>:',
		'', '',
		`${nameInvalid.true ? nameInvalid.errorMessage : ''}`
	];

	let edit = false

	let possiblePages = loadParents();

	let parentPageInvalid = { true: false, errorMessage: '' };
	let parentContainerInvalid = { true: false, errorMessage: '' };

	let categoryName: string = '';

	let nameInvalid = { true: false, errorMessage: '' };

	let ref: any;
</script>

<div class="w-full">
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

	<Select
		bind:selectedValue={selectedContainer}
		options={selectedPage.containers}
		optionTextFormatter={formatContainerOptionText}
		name="parentContainer"
		labels={parentContainerLabels}
		disabled={selectedPage.containers.length <= 1}
		invalid={parentContainerInvalid.true}
	/>

	<Input bind:ref bind:value={categoryName} name="name" placeholder="Weir Doe" labels={nameLabels} invalid={nameInvalid.true} />

	<ActionButtons proceedText="Save" abortText="Discard" on:proceed={proceed} on:abort={abort} />
</div>
