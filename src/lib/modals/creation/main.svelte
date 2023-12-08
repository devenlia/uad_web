<!-- Copyright (C) 2023 Jannis Machowetz -->
<script lang="ts">
	import IconParkOutlineRight from 'virtual:icons/icon-park-outline/right';
	import IconParkOutlineClose from 'virtual:icons/icon-park-outline/close';
	import { Visible, Action, Tutorial } from './store';
	import { PageCreation, ContainerCreation, CategoryCreation, LinkCreation } from './components';
	import { onMount } from 'svelte';
	import { closeContentWizard } from './';

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
		<div class="flex flex-row justify-between align-middle h-8">
			<h1 class="text-lg">
				{action === 'select'
					? 'Select the type of content you want to add'
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
				<div class="tooltip" data-tip="Not yet implemented.">
					<button on:click={() => Tutorial.set(true)} class="btn btn-sm btn-ghost btn-square btn-disabled">?</button>
				</div>
				<button on:click={closeContentWizard} class="btn btn-sm btn-ghost btn-square"><IconParkOutlineClose /></button>
			</div>
		</div>
		<div class="divider my-0" />

		<div class="overflow-y-auto overflow-x-visible px-3" style="max-height: calc(100vh - 5em - 96px);">
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
				<PageCreation />
			{:else if action === 'container'}
				<ContainerCreation />
			{:else if action === 'category'}
				<CategoryCreation />
			{:else if action === 'link'}
				<LinkCreation />
			{/if}
		</div>

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
