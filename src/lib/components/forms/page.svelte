<!-- Copyright (C) 2023 Jannis Machowetz -->
<script lang="ts">
	import { ActionButtons, Input, Select } from './elements';
	import type { Page } from '$lib/types';
	import { createEventDispatcher, onMount } from 'svelte';
	import { closeContentWizard } from '$lib/modals/creation';
	import { throwError } from '$lib/utils';

	export let page: Page | null = null;
	export let selectedParent: Page | null;

	const loadParents = async (): Promise<Array<Page> | null> => {
		let res: Response = await fetch(`/get?type=list`);

		if (res.status != 200) {
			await closeContentWizard();
			throwError(res.status, await res.text());
			return null;
		}

		let pages = await res.json();
		selectedParent = pages.find((obj: any) => obj.id === (selectedParent ? selectedParent?.id : '0'));

		if (page) {
			pages = pages.filter((obj: Page) => obj.id !== page?.id);
		}

		return pages;
	};

	const validateForm = async () => {
		// Validate parent
		if (!selectedParent) {
			parentInvalid = { true: true, errorMessage: 'No page selected! Dafug??' };
			return false;
		}

		// Validate name
		pageName = pageName?.trim();
		if (!pageName || pageName === '') {
			nameInvalid = { true: true, errorMessage: 'Supply a name!' };
			return false;
		}

		let res: Response = await fetch(`/get?type=list`);

		if ((await res.json()).find((obj: Page) => obj.path === convertNameToPath(selectedParent!.path, pageName))) {
			nameInvalid = { true: true, errorMessage: 'Name already taken!' };
			return false;
		}

		nameInvalid = { true: false, errorMessage: '' };
		return true;
	};

	const proceed = async () => {
		if (await validateForm()) {
			dispatch('proceed', {
				page: {
					name: pageName,
					parentId: selectedParent!.id,
					path: convertNameToPath(selectedParent!.path, pageName)
				}
			});
		}
	};

	const abort = () => {
		dispatch('abort');
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			proceed();
		}
	};

	const convertNameToPath = (basePath: string, name: string): string => {
		return (
			basePath +
			'.' +
			(name
				?.toLowerCase()
				.replaceAll(/\u00fc/g, 'ue')
				.replaceAll(/\u00f6/g, 'oe')
				.replaceAll(/\u00e4/g, 'ae')
				.replaceAll(/\u00df/g, 'ss')
				.replaceAll(/\s/g, '') ?? 'newPage')
		);
	};

	const formatOptionText = (option: Page) => {
		return option.name + ' (' + option.path.replaceAll('.', ' > ') + ')';
	};

	onMount(() => {
		if (page) {
			pageName = page.name;
			edit = true;
		}
		window.addEventListener('keydown', handleKeyDown);
		ref.focus();
		return () => window.removeEventListener('keydown', handleKeyDown);
	});

	const dispatch = createEventDispatcher();

	$: parentLabels = [edit ? 'Select the new <b>parent</b> of the page:' : 'Select the <b>parent</b> of your new page:', '', '', `${parentInvalid.true ? parentInvalid.errorMessage : ''}`];
	$: nameLabels = [
		edit ? 'Edit the <b>name</b> of the page:' : 'Give your page a <b>name</b>:',
		'',
		`Path will be: ${convertNameToPath(selectedParent?.path ?? 'loading', pageName != '' ? pageName : 'newPage')}`,
		`${nameInvalid.true ? nameInvalid.errorMessage : ''}`
	];

	let edit = false;

	let possibleParents = loadParents();

	let parentInvalid = { true: false, errorMessage: '' };

	let pageName: string = '';

	let nameInvalid = { true: false, errorMessage: '' };

	let ref: any;
</script>

<div class="w-full">
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

	<Input bind:ref bind:value={pageName} name="name" placeholder="Nathaneal Down" labels={nameLabels} invalid={nameInvalid.true} />

	<ActionButtons proceedText="Save" abortText="Discard" on:proceed={proceed} on:abort={abort} />
</div>
