<!-- Copyright (C) 2023 Jannis Machowetz -->
<script lang="ts">
	import type { PageData } from './$types';
	import { SubpageCard, Container } from '$lib/components';
	import { PlaceholderCat, SadCat } from '$lib/assets';
	import { openContentWizard } from '$lib/modals/contentWizard';

	export let data: PageData;
</script>

<base href={data.basePath} />

{#if data.page.subpages.length !== 0}
	<div class="grid grid-cols-4 gap-3">
		{#each data.page.subpages as subpage}
			<SubpageCard {subpage} />
		{/each}
	</div>

	<div class="divider text-accent" />
{/if}

{#if data.page.containers.length !== 0}
	{#each data.page.containers as container}
		<Container {container} />
	{/each}
{:else if data.page.path === "home"}
	<div class="h-screen w-full flex justify-center items-center -z-[5] top-0 left-0 absolute">
		<div class="h-min flex flex-row items-center">
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
	</div>
{/if}