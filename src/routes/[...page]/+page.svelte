<!-- Copyright (C) 2023 Jannis Machowetz -->
<script lang="ts">
	import type { PageData } from './$types';
	import { SubpageCard, Container } from '$lib/components';
	import { Desert, PlaceholderCat, SadCat } from '$lib/assets';
	import { openContentWizard } from '$lib/modals/contentWizard';

	export let data: PageData;

	$: containers = data.page.containers.sort((a, b) => a.name.localeCompare(b.name));
	$: subpages = data.page.subpages.sort((a, b) => a.name.localeCompare(b.name));
</script>

<svelte:head>
	<title>UAD - {data.page.name}</title>
</svelte:head>

<div class="max-h-full overflow-y-auto overflow-x-hidden" style="height: calc(100% - 20px)">
	{#if subpages.length !== 0}
		<div class="grid grid-cols-4 gap-3">
			{#each subpages as subpage}
				<SubpageCard {subpage} />
			{/each}
		</div>

		<div class="divider text-accent" />
	{/if}

	{#if data.page.containers.length !== 0}
		{#each containers as container}
			<Container {container} />
		{/each}
	{:else}
		<div class="h-full w-full flex justify-center items-center">
			{#if data.page.path === "home"}
				<div class="h-min flex flex-row items-center z-auto relative">
					<div class="w-max">
						<h1 class="text-7xl">Welcome to <br/> UAD</h1>
						<p class="text-xl mb-10">Your new Unified Application Directory</p>

						<button on:click={() => openContentWizard('container', null, data.page.id, true)} class="btn btn-outline">Start to add your first container!</button>
						<div class="tooltip" data-tip="Not yet implemented.">
							<button on:click={() => {}} class="btn btn-primary btn-disabled" >Take a tour.</button>
						</div>
					</div>

					<div class="w-max h-min">
						<img height="200px" width="200px" src={PlaceholderCat} alt="SadCat" />
					</div>
				</div>
			{:else }
				<img src="{Desert}" alt="desert">
			{/if}
		</div>
	{/if}
</div>

