<!-- Copyright (C) 2023 Jannis Machowetz -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let options: Array<any>;
	export let optionTextFormatter: any;
	export let selectedValue: any;
	export let name: string;
	export let labels: Array<string>;
	export let invalid: boolean = false;
	export let disabled: boolean = false;

	const dispatch = createEventDispatcher();

	const onChange = (e: any) => {
		dispatch('change', { event: e });
	};
</script>

<label class="label" for={name}>
	{#if labels[0] !== ''}
		<span class="label-text">{@html labels[0]}</span>
	{/if}
	{#if labels[1] !== ''}
		<span class="label-text">{@html labels[1]}</span>
	{/if}
</label>
<select {disabled} {name} bind:value={selectedValue} on:change={onChange} class:select-error={invalid} class="mb-3 select select-bordered w-full">
	{#each options as option}
		<option value={option}>{optionTextFormatter(option)}</option>
	{/each}
</select>
<label class="label" for={name}>
	{#if labels[2] !== ''}
		<span class="label-text">{@html labels[2]}</span>
	{/if}
	{#if labels[3] !== ''}
		<span class="label-text">{@html labels[3]}</span>
	{/if}
</label>
