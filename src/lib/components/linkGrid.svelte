<script lang="ts">
	import {dndzone} from 'svelte-dnd-action';
	import {flip} from 'svelte/animate';

	export let itemsData : Array<any>;
	export let onDrop : any;

	function handleConsider(e : any) {
		itemsData = e.detail.items;
	}

	function handleFinalize(e : any) {
		onDrop(e.detail.items);
	}
</script>

<section class="w-full flex flex-wrap p-1 gap-3" use:dndzone={({items: itemsData, flipDurationMs: 300, type: 'link', dropTargetClasses: ['border', 'border-accent', 'rounded-btn'], dropTargetStyle: {}, centreDraggedOnCursor: true})} on:consider={handleConsider} on:finalize={handleFinalize}>
	{#each itemsData as item (item.id)}
		<div animate:flip={({duration: 300})} class="flex-auto min-w-max">
			<a target="_blank" class="btn btn-primary w-full h-full" href={item.href?.toString() ?? '/'}>{item.name}</a>
		</div>
	{/each}
</section>