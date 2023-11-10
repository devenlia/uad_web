<script lang="ts">
	import IconParkOutlineRight from 'virtual:icons/icon-park-outline/right';
	import IconParkOutlineClose from 'virtual:icons/icon-park-outline/close';
	import { Step, Visible, Action, Tutorial, Parent } from './store';
	import AddPage from './addPage.svelte';
	import AddContainer from './addContainer.svelte';
	import AddCategory from './addCategory.svelte';
	import AddLink from './addLink.svelte';
	import { onMount } from 'svelte';
	import { closeContentWizard } from '$lib/modals/contentWizard/index';
	import { error } from '@sveltejs/kit';
	import { get } from 'svelte/store';

	let visible: boolean;
	Visible.subscribe((v) => {
		visible = v;
	});

	let action: string;
	Action.subscribe((v) => {
		action = v;
	});

	let actions = [
		{
			type: 'Page',
			action: () => {
				Action.set('page');
			}
		},
		{
			type: 'Container',
			action: () => {
				Action.set('container');
			}
		},
		{
			type: 'Category',
			action: () => {
				Action.set('category');
			}
		},
		{
			type: 'Link',
			action: () => {
				Action.set('link');
			}
		}
	];

	onMount(() => {
		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	});

	const handleKeyDown = (event: KeyboardEvent) => {
		if (visible && event.key === 'Escape') {
			closeContentWizard();
		}
	};
</script>

<div class="modal" class:modal-open={visible}>
	<div class="modal-box w-screen">
		<div class="flex flex-row justify-between align-middle">
			<h1 class="text-lg">
				{action === 'select'
					? 'Select the type of content you want to contentWizard'
					: action === 'page'
					? 'Add a new subpage to an existing page'
					: action === 'container'
					? 'Add a container'
					: action === 'category'
					? 'Add a category'
					: action === 'link'
					? 'Add a link to access your application'
					: 'Add new content to your UAD'}
			</h1>
			<div class="flex flex-row justify-between align-middle gap-1.5">
				<button on:click={() => Tutorial.set(true)} class="btn btn-sm btn-ghost btn-square">?</button>
				<button on:click={closeContentWizard} class="btn btn-sm btn-ghost btn-square"><IconParkOutlineClose /></button>
			</div>
		</div>
		<div class="divider my-0" />

		{#if action === 'select'}
			{#each actions as action}
				<button on:click={action.action} class=" w-full card hover:bg-base-200 hover:cursor-pointer hover:text-primary">
					<span class="w-full card-body p-4 flex-row justify-between items-center">
						<span>{action.type}</span>
						<IconParkOutlineRight />
					</span>
				</button>
			{/each}
		{:else if action === 'page'}
			<AddPage />
		{:else if action === 'container'}
			<AddContainer />
		{:else if action === 'category'}
			<AddCategory />
		{:else if action === 'link'}
			<AddLink />
		{/if}

		<!--
    <div class="divider my-0"></div>
    <ul class="steps w-full">
      <li class="step {step >= 0 ? 'step-primary' : ''}"></li>
      <li class="step {step >= 1 ? 'step-primary' : ''}"></li>
      <li class="step {step >= 2 ? 'step-primary' : ''}"></li>
      <li class="step {step >= 3 ? 'step-primary' : ''}"></li>
    </ul>
-->
	</div>
</div>
