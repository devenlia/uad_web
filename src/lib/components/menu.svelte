<!-- Copyright (C) 2023 Jannis Machowetz -->
<script lang="ts">
	import IconParkOutlineMoon from 'virtual:icons/icon-park-outline/moon';
	import IconParkOutlineSun from 'virtual:icons/icon-park-outline/sun';
	import { onMount } from 'svelte';
	import { themeChange } from 'theme-change';
	import { Logo } from '$lib/assets';

	let lightTheme: boolean;

	onMount(() => {
		themeChange(false);

		const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
		const theme = document.documentElement.getAttribute('data-theme');

		if (!theme || !theme.startsWith('uad')) {
			if (systemTheme.matches) {
				document.documentElement.setAttribute('data-theme', 'uad_dark')
			}
			else {
				document.documentElement.setAttribute('data-theme', 'uad_light')
			}
		}

		lightTheme = document.documentElement.getAttribute('data-theme') === 'uad_light';
	});
</script>

<div class="menu bg-base-200 rounded-box h-full flex justify-between">
	<ul>
		<li class="w-12 h-12">
			<a class="w-full h-full p-1" href="/"><img width="100%" height="100%" alt="Logo" src={Logo}/></a>
		</li>
	</ul>

	<ul>
		<li>
			<label class="swap swap-rotate {lightTheme ? 'text-yellow-400' : 'text-purple-600'}">
				<input id="themeCheckbox" type="checkbox" bind:checked={lightTheme} data-toggle-theme="uad_dark,uad_light" data-act-class="ACTIVECLASS"/>
				<span class="swap-off fill-current"><IconParkOutlineMoon /></span>
				<span class="swap-on fill-current"><IconParkOutlineSun /></span>
			</label>
		</li>
	</ul>
</div>
