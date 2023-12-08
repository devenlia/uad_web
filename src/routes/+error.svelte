<!-- Copyright (C) 2023 Jannis Machowetz -->
<script lang="ts">
	import { page } from '$app/stores';
	import Catty from '$lib/assets/catty.svg?raw';
	import IconParkOutlineHouse from 'virtual:icons/icon-park-outline/home';
	import { PlaceholderCat } from '$lib/assets';

	console.log($page);

	let heading: string;
	let pageName = $page.params.page?.split('/').pop();

	switch ($page.status) {
		case 404:
			heading = 'Not found';
			break;
		default:
			heading = `Error: ${$page.status}`;
	}
</script>

<div class="w-full">
	<header class="navbar bg-base-200 rounded-box">
		<div class="navbar-start">
			<a href="/home" class="btn btn-square text-lg"><IconParkOutlineHouse /></a>
		</div>
		<div class="navbar-center">
			<p class="text-5xl font-bold">{heading}</p>
		</div>
		<div class="navbar-end" />
	</header>

	{#if $page.status === 404}
		<div class="flex flex-col items-center justify-center mt-20 overflow-y-auto">
			<h1 class="text-6xl text-center">Oops!</h1>
			<div class="max-w-md m-5"><img width="200px" src={PlaceholderCat} alt="Placeholder Cat" /></div>
			<p class="text-center text-3xl">I was unable to locate the page '{pageName}' you were searching for.</p>
			<p class="text-center text-3xl">Perhaps it was typed incorrectly?</p>
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center mt-20 overflow-y-auto">
			<h1 class="text-6xl text-center">OH NO!</h1>
			<!--<div class="max-w-md m-5">{@html Catty}</div>-->
			<div class="max-w-md m-5"><img width="200px" src={PlaceholderCat} alt="Placeholder Cat" /></div>
			<p class="text-center text-3xl">My application ... its broken.</p>
		</div>
	{/if}
</div>
