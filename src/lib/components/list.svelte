<script lang="ts">
	import { dndzone } from 'svelte-dnd-action';
	import { openContentWizard } from '$lib/modals/contentWizard';

	export let items : Array<any>;
	export let onDrop : any;
	export let itemComponent : any;

	let dragDisabled = false;

	function handleConsider(e : any) {
		const {items: newItemsList} = e.detail;
		items = newItemsList;
	}

	function handleFinalize(e : any) {
		onDrop(e.detail.items);
		//dragDisabled = true;
	}

	function startDrag(e : any) {
		dragDisabled = false;
	}
</script>

<section
	use:dndzone="{({items, dragDisabled, type: 'category', dropTargetClasses: ['border', 'border-accent', 'rounded-btn'], dropTargetStyle: {}})}"
	on:consider="{handleConsider}"
	on:finalize="{handleFinalize}">
	{#each items as item (item.id)}
		<svelte:component this={itemComponent} {item} /><!--onStartDrag={startDrag}-->
	{:else}
		<slot/>
	{/each}
</section>
