<!-- Copyright (C) 2023 Jannis Machowetz -->
<script lang="ts">
	import type { Container } from '$lib/types';
	import { Category } from '$lib/components/index';
	import Catty from '$lib/assets/catty.svg';
	import IconParkOutlineMore from 'virtual:icons/icon-park-outline/more-one';
	import IconParkOutlinePlus from 'virtual:icons/icon-park-outline/plus';
	import { openDeleteConfirmation } from '../modals/deleteConfirmation';
	import IconParkOutlineDelete from 'virtual:icons/icon-park-outline/delete';
	import { invalidateAll } from '$app/navigation';
	import { openContentWizard } from '../modals/contentWizard';
	import { PlaceholderCat } from '$lib/assets';

	export let container: Container;

	const deleteContainer = async () => {
		const formData = new FormData();
		formData.append('type', 'container');
		formData.append('id', container.id);

		await fetch('/?/delete', { method: 'POST', body: formData });
		await invalidateAll();
	};
</script>

<div class="mt-5 border-2 border-gray-400 rounded-box">
	<div class="text-2xl bg-base-100 relative w-max px-3 py-1 rounded-box flex flex-row group" style="top: -20px; left: 20px">
		<h1>{container.name}</h1>
		<details class="dropdown">
			<summary class="ml-1 btn btn-square btn-ghost btn-sm text-lg"><IconParkOutlineMore /></summary>
			<ul class="p-2 shadow menu dropdown-content z-[5] bg-base-100 rounded-box w-52">
				<li><button on:click={() => openDeleteConfirmation(deleteContainer)}><IconParkOutlineDelete /><span>Delete</span></button></li>
				<li><button on:click={() => openContentWizard('category', null, container.id)}><IconParkOutlinePlus /><span>Add a category</span></button></li>
			</ul>
		</details>
	</div>

	<div class="px-3 pb-3">
		{#each container.categories as category}
			<Category {category} />
		{:else}
			<div class="flex flex-row h-20 w-full justify-center content-center">
				<div class="chat chat-end h-max">
					<div class="chat-bubble chat-bubble-accent max-w-max flex flex-col justify-center content-center">
						<h2 class="text-lg font-bold whitespace-nowrap w-max">Oh no, there are no categories yet!</h2>
						<button on:click={() => openContentWizard('category', null, container.id)} class="btn btn-ghost btn-sm">Let's add one!</button>
					</div>
				</div>
				<img src={PlaceholderCat} alt="Catty" />
			</div>
		{/each}
	</div>
</div>
