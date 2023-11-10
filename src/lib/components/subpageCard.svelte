<script lang="ts">
	import IconParkOutlineRight from 'virtual:icons/icon-park-outline/right';
	import type { SubPage } from '$lib/types';

	export let subpage: SubPage;

	$: href = '/' + subpage.path.replaceAll(/\./g, '/');
</script>

<a {href} class="card bg-base-200 hover:bg-base-300 hover:cursor-pointer hover:text-primary">
	<div class="card-body p-4 flex-row justify-between align-middle">
		<p>{subpage.name}</p>
		<IconParkOutlineRight />
	</div>
</a>
