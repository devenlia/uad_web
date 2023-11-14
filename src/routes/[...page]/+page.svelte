<script lang="ts">
	import type { PageData } from './$types';
	import { SubpageCard, Container } from '$lib/components';
	import { SadCat } from '$lib/assets';
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
{:else}
	<div class="h-full w-full flex justify-center content-center">
		<div class="mt-40 h-min flex flex-row content-center">
			<div class="w-96">
				<h1 class="text-7xl">Welcome to UAD</h1>
				<p class="text-xl mb-10">Your new Unified Application Directory</p>

				<div class="tooltip" data-tip="Not fully implemented.">
					<button on:click={() => openContentWizard('container', null, data.page.id, true)} class="btn btn-outline">Start to add your first link!</button>
				</div>
				<div class="tooltip" data-tip="Not yet implemented.">
					<button on:click={() => {}} class="btn btn-primary btn-disabled" >Take a tour.</button>
				</div>
			</div>
			<div class="w-96">
				<img src={SadCat} alt="SadCat" />
			</div>
		</div>
	</div>
{/if}