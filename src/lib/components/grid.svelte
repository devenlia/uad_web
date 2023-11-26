<script lang="ts">
	import {dndzone} from 'svelte-dnd-action';
	import {flip} from 'svelte/animate';
	import type { SvelteComponent } from 'svelte';

	export let itemsData : Array<any>;
	export let itemComponent : ConstructorOfATypedSvelteComponent;
	export let type : string;
	export let onDrop : any;
	export let idPropertyName = "id";
	export let flipDurationMs = 300;

	function handleConsider(e : any) {
		itemsData = e.detail.items;
	}
	function handleFinalize(e : any) {
		onDrop(e.detail.items);
	}
</script>

<section class="w-full flex flex-wrap gap-3" use:dndzone={({items: itemsData, flipDurationMs, type})} on:consider={handleConsider} on:finalize={handleFinalize}>
	{#each itemsData as item(item[idPropertyName])}
		<div animate:flip={({duration: flipDurationMs})} class="flex-auto min-w-max">
			<svelte:component this={itemComponent} {item}/>
		</div>
	{/each}
</section>