<!-- Copyright (C) 2023 Jannis Machowetz -->
<script lang="ts">
	import { closeContentWizard } from '$lib/modals/creation/index.js';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { Category, Container, Link, Page } from '$lib/types';
	import { ActionButtons, Input, Select } from '$lib/components/forms/elements';
	import { throwError } from '$lib/utils';
	import validator from 'validator';

	export let link : Link | null = null
	export let selectedPage: Page;
	export let selectedContainer: Container;
	export let selectedCategory: Category | null;

	async function loadParents() {
		let res: Response = await fetch(`/get?type=list`);

		if (res.status != 200) {
			await closeContentWizard();
			throwError(res.status, await res.text());
			return null;
		}

		let pages = await res.json();
		selectedPage = pages.find((obj: any) => obj.id === selectedPage.id);
		selectedContainer = selectedPage.containers.find((obj: any) => obj.id === selectedContainer.id) ?? selectedPage.containers[0];
		selectedCategory = selectedContainer.categories.find((obj: any) => obj.id === selectedCategory?.id) ?? selectedContainer.categories[0];

		return pages;
	}

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

		if (!selectedCategory) {
			parentContainerInvalid = { true: true, errorMessage: 'No category selected!' };
			return false;
		}
		parentContainerInvalid = { true: false, errorMessage: '' };

		linkName = linkName?.trim();
		if (linkName == '') {
			nameInvalid = { true: true, errorMessage: 'Supply a name!' };
			return false;
		}
		nameInvalid = { true: false, errorMessage: '' };

		linkHref = linkHref?.trim();
		if (linkHref == '') {
			hrefInvalid = { true: true, errorMessage: 'Supply a destination!' };
			return false;
		}
		else if (!linkHref.startsWith('http://') || !linkHref.startsWith('https://')) {
			linkHref = 'https://' + linkHref
		}
		if (!validator.isURL(linkHref, { require_protocol: true })) {
			hrefInvalid = { true: true, errorMessage: 'Invalid URL!' };
			return false;
		}
		hrefInvalid = { true: false, errorMessage: '' };

		return true;
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			proceed();
		}
	};

	const onParentPageChange = () => {
		selectedContainer = selectedPage.containers[0];
		selectedCategory = selectedContainer.categories[0];
	};

	const onParentContainerChange = () => {
		selectedCategory = selectedContainer.categories[0];
	};

	onMount(() => {
		if (link) {
			linkName = link.name
			linkHref = link.href
			edit = true
		}
		window.addEventListener('keydown', handleKeyDown);
		ref.focus();
		return () => window.removeEventListener('keydown', handleKeyDown);
	});

	const proceed = async () => {
		if (validateForm()) {
			dispatch('proceed', { link: {
				name: linkName,
				href: linkHref,
				parentId: selectedCategory!.id } });
		}
	};

	const abort = () => {
		dispatch('abort');
	}

	const dispatch = createEventDispatcher();

	$: parentPageLabels = [
		edit ? 'Select the new <b>parent page</b> of the link:' : 'Select the <b>parent page</b> of your new link:',
		'', '',
		`${parentPageInvalid.true ? parentPageInvalid.errorMessage : ''}`
	];
	$: parentContainerLabels = [
		edit ? 'Select the new <b>parent container</b> of the link:' : 'Select the <b>parent container</b> of your new link:',
		'', '',
		`${parentContainerInvalid.true ? parentContainerInvalid.errorMessage : ''}`
	];
	$: parentCategoryLabels = [
		edit ? 'Select the new <b>parent category</b> of the link:' : 'Select the <b>parent category</b> of your new link:',
		'', '',
		`${parentCategoryInvalid.true ? parentCategoryInvalid.errorMessage : ''}`
	];
	$: nameLabels = [
		edit ? 'Edit the <b>name</b> of the link:' : 'Give your link a <b>name</b>:',
		'', '',
		`${nameInvalid.true ? nameInvalid.errorMessage : ''}`
	];
	$: hrefLabels = [
		edit ? 'Edit the <b>target URL</b> of the link:' : 'Please specify the <b>target URL</b> for your new link:',
		'', '',
		`${hrefInvalid.true ? hrefInvalid.errorMessage : ''}`
	];

	let edit = false

	let possiblePages = loadParents()

	let parentPageInvalid = { true: false, errorMessage: '' };
	let parentContainerInvalid = { true: false, errorMessage: '' };
	let parentCategoryInvalid = { true: false, errorMessage: '' };

	let linkName: string = '';
	let linkHref: string = '';

	let nameInvalid = { true: false, errorMessage: '' };
	let hrefInvalid = { true: false, errorMessage: '' };

	let ref: any;
</script>

<div class="w-full">
	{#if possiblePages != null}
		{#await possiblePages}
			<Select bind:selectedValue={selectedPage} options={[selectedPage]} optionTextFormatter={formatPageOptionText} name="parentPage" labels={parentPageLabels} disabled={true} />
		{:then values}
			{#if values}
				<Select
					on:change={onParentPageChange}
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
		on:change={onParentContainerChange}
		bind:selectedValue={selectedContainer}
		options={selectedPage.containers}
		optionTextFormatter={formatContainerOptionText}
		name="parentContainer"
		labels={parentContainerLabels}
		disabled={selectedPage.containers.length <= 1}
		invalid={parentContainerInvalid.true}
	/>

	<Select
		bind:selectedValue={selectedCategory}
		options={selectedContainer.categories}
		optionTextFormatter={formatContainerOptionText}
		name="parentContainer"
		labels={parentCategoryLabels}
		disabled={selectedContainer.categories.length <= 1}
		invalid={parentCategoryInvalid.true}
	/>

	<Input bind:ref bind:value={linkName} name="name" placeholder="Elon Gated" labels={nameLabels} invalid={nameInvalid.true} />
	<Input bind:value={linkHref} name="href" placeholder="https://www.example.com" labels={hrefLabels} invalid={hrefInvalid.true} />

	<ActionButtons proceedText="Save" abortText="Discard" on:proceed={proceed} on:abort={abort} />
</div>
