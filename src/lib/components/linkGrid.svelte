<!-- Copyright (C) 2023 Jannis Machowetz -->
<script lang="ts">
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import { Link } from '.'

	export let itemsData: Array<any>;
	export let onDrop: any;
	export let editMode: boolean;

	function handleConsider(e: any) {
		itemsData = e.detail.items;
	}

	function handleFinalize(e: any) {
		onDrop(e.detail.items);
	}
</script>

<section
	class="w-full flex items-stretch p-1 gap-3"
	use:dndzone={({ items: itemsData, flipDurationMs: 300, type: 'link', dropTargetClasses: ['border', 'border-accent', 'rounded-btn'], dropTargetStyle: {}, centreDraggedOnCursor: true })}
	on:consider={handleConsider}
	on:finalize={handleFinalize}
>
	{#each itemsData as item (item.id)}
		<div animate:flip={({ duration: 300 })} class="w-full">
			<Link link={item} editMode={editMode}/>
		</div>
	{/each}
</section>
