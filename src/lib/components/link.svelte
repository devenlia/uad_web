<script lang="ts">
	import { openDeleteConfirmation } from '$lib/modals/deletion/index.js';
	import IconParkOutlineDelete from 'virtual:icons/icon-park-outline/delete';
	import type { Link, RGB } from '$lib/types';
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import IconParkOutlineEdit from 'virtual:icons/icon-park-outline/edit-one';
	import IconParkOutlineWrite from 'virtual:icons/icon-park-outline/write';
	import { openModificationModal } from '$lib/modals/modification';

	export let link: Link;
	export let editMode: boolean;

	const setBorderColor = (rgb: RGB, threshold = 64) => {
		const blackDistance = Math.sqrt(rgb[0] * rgb[0] + rgb[1] * rgb[1] + rgb[2] * rgb[2]);
		const whiteDistance = Math.sqrt(Math.pow(255 - rgb[0], 2) + Math.pow(255 - rgb[1], 2) + Math.pow(255 - rgb[2], 2));

		if (blackDistance < threshold || whiteDistance < threshold)
			border = true;
	};

	const isLight = (rgb: RGB) => {
		const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
		return brightness > 128;
	};

	onMount(async () => {
		let res = await fetch(`/get/favicon?url=${link.href}`);

		if (res.status == 200) {
			let data = await res.json();

			if (data.favicon && data.favicon != 'none') {
				favicon = data.favicon;
				fontWhite = !isLight(data.color);
				color = `rgb(${data.color[0]}, ${data.color[1]}, ${data.color[2]})`;

				setBorderColor(data.color);
			}
		}
	});

	const deleteLink = async (link: Link) => {
		const formData = new FormData();
		formData.append('type', 'link');
		formData.append('id', link.id);

		await fetch('/?/delete', { method: 'POST', body: formData });
		await invalidateAll();
	};

	let fontWhite: boolean;
	let favicon: string;
	let color: string;
	let border = false;
</script>

<div class="w-full flex gap-1 rounded-btn {editMode ? 'hover:outline outline-accent outline-1' : ''}">

	{#if editMode}
		<div class="flex justify-between items-center bg-neutral h-12 w-full rounded-btn px-3">
			<span class="avatar w-8">
					{#if favicon && favicon !== "none"}
						<img class="mask mask-squircle p-1 {editMode ? 'bg-gray-400' : 'bg-white'}"
								 src={'data:image/ico;base64, ' + favicon} alt="favicon">
					{/if}
				</span>
			{link.name}
			<div class="dropdown dropdown-hover dropdown-left">
				<div tabindex="0" role="button" class="btn btn-square btn-ghost btn-sm"><IconParkOutlineWrite /></div>
				<div tabindex="0" class="dropdown-content z-[1] bg-base-100 rounded-xl w-max flex gap-1 p-1" style="margin-top: -4px">
					<div class="tooltip tooltip-top tooltip-info" data-tip="Edit this link">
						<button on:click={() => openModificationModal('link', link)} class="btn btn-square btn-ghost btn-sm">
							<IconParkOutlineEdit />
						</button>
					</div>
					<div class="tooltip tooltip-top tooltip-info" data-tip="Delete this link">
						<button on:click={() => openDeleteConfirmation(() => deleteLink(link))} class="btn btn-square btn-ghost btn-sm hover:text-error">
							<IconParkOutlineDelete />
						</button>
					</div>
				</div>
			</div>
		</div>

	{:else}
		<div class="flex-auto" class:tooltip={!editMode} data-tip={link.href}>
			<a href={link.href} target="_blank" class:text-white={fontWhite}
				 class="flex justify-between btn btn-primary h-full w-full {editMode ? 'btn-disabled pointer-events-none' : ''} {border ?  'border-neutral' : 'border-none'}"
				 style={(color && color !== "none" && !editMode) ? 'background-color: ' + color : ''}>
				<span class="avatar w-8">
					{#if favicon && favicon !== "none"}
						<img class="mask mask-squircle p-1 {editMode ? 'bg-gray-400' : 'bg-white'}"
								 src={'data:image/ico;base64, ' + favicon} alt="favicon">
					{/if}
				</span>
				{link.name}
				<span class="avatar w-8"/>
			</a>
		</div>
	{/if}


</div>