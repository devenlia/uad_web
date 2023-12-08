<!-- Copyright (C) 2023 Jannis Machowetz -->
<script lang="ts">
	import type { LayoutData } from './$types';
	import IconParkOutlinePlus from 'virtual:icons/icon-park-outline/plus';
	import IconParkOutlineMore from 'virtual:icons/icon-park-outline/more-one';
	import IconParkOutlineDelete from 'virtual:icons/icon-park-outline/delete';
	import { openContentWizard } from '$lib/modals/creation';
	import { goto } from '$app/navigation';
	import { openDeleteConfirmation } from '$lib/modals/deletion';

	export let data: LayoutData;

	const getPage = async (path: string) => {
		let res = await fetch(`/get?type=search&path=${path}`);

		return await res.json();
	};

	const deletePage = async () => {
		let page = await getPage(data.path);
		if (!page) return;

		const formData = new FormData();
		formData.append('type', 'page');
		formData.append('id', page.id);

		await fetch('/?/delete', { method: 'POST', body: formData });

		await goto('../');
	};
</script>

<div class="h-screen w-full">
	<header class="fixed top-3 right-3" style="left: 89px">
		<div class="navbar bg-base-200 rounded-box">
			<div class="flex-1">
				<div class="text-2xl breadcrumbs">
					<ul>
						{#if data.breadcrumbs && data.breadcrumbs.length > 1}
							{#each data.breadcrumbs as breadcrumb}
								<li><a href={breadcrumb.href} class="btn btn-sm btn-ghost normal-case text-lg !no-underline hover:text-primary">{breadcrumb.name}</a></li>
							{/each}
						{:else}
							<li><a href="/" class="btn btn-sm btn-ghost normal-case text-lg !no-underline hover:text-primary">Home</a></li>{/if}
					</ul>
				</div>
			</div>
			<div class="flex-none">
				<button on:click={() => openContentWizard('select', data.path)} class="btn btn-square btn-ghost text-lg m-1"><IconParkOutlinePlus /></button>
				<div class:tooltip={data.path === 'home'} class="tooltip tooltip-left" data-tip={data.path === 'home' ? 'The homepage cannot be deleted.' : ''}>
					<button on:click={() => openDeleteConfirmation(deletePage)} class="btn btn-square btn-ghost text-md m-1 {data.path === 'home' ? 'btn-disabled' : 'hover:text-error'}"
						><IconParkOutlineDelete /></button
					>
				</div>
			</div>
		</div>
	</header>

	<div class="h-screen" style="padding-top: 84px">
		<slot />
	</div>
</div>
