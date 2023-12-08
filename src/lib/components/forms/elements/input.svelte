<!-- Copyright (C) 2023 Jannis Machowetz -->
<script lang="ts">
	export let value: string;
	export let name: string;
	export let placeholder: string;
	export let labels: Array<String>;
	export let invalid: boolean = false;

	export let ref: any = null;
</script>

<label class="label" for={name}>
	{#if labels[0] !== ''}
		<span class="label-text">{@html labels[0]}</span>
	{/if}
	{#if labels[1] !== ''}
		<span class="label-text">{@html labels[1]}</span>
	{/if}
</label>
<input bind:this={ref} {name} type="text" {placeholder} class="input input-bordered w-full" class:input-error={invalid} bind:value />
<label class="label" for={name}>
	<span>
		{#if labels[2] !== ''}
			<span class="label-text">{@html labels[2]}</span>
		{/if}
	</span>
	<span>
		{#if labels[3] !== ''}
			<span class="label-text text-error">{@html labels[3]}</span>
		{/if}
	</span>
</label>
