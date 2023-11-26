<script lang="ts">
	import type { Link } from '$lib/types';

	export let item : Link;
</script>

<a target="_blank" class="btn btn-primary w-full h-full max-w-2xl" href={item.href?.toString() ?? '/'}>{item.name}</a>