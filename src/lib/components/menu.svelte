<script lang="ts">
	import Logo from '$lib/assets/logo.jpg';
	import IconParkOutlineMoon from 'virtual:icons/icon-park-outline/moon';
	import IconParkOutlineSun from 'virtual:icons/icon-park-outline/sun';
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';

	let lightTheme: boolean;

	onMount(() => {
		themeChange(false);
		lightTheme = document.documentElement.getAttribute('data-theme') == 'light';
	});
</script>

<div class="menu bg-base-200 rounded-box h-full flex justify-between">
	<ul>
		<li class="w-12 h-12">
			<a class="p-0" href="/"><img class="mask mask-squircle p-0" alt="Logo" src={Logo} /></a>
		</li>
	</ul>

	<ul>
		<li>
			<label class="swap swap-rotate {lightTheme ? 'text-yellow-400' : 'text-purple-600'}">
				<input id="themeCheckbox" type="checkbox" bind:checked={lightTheme} data-toggle-theme="dark,light" />
				<span class="swap-off fill-current"><IconParkOutlineMoon /></span>
				<span class="swap-on fill-current"><IconParkOutlineSun /></span>
			</label>
		</li>
	</ul>
</div>
