<script lang="ts">
	export let item : any;
</script>

<a target="_blank" class="btn btn-primary w-full h-full max-w-2xl" href={item.href?.toString() ?? '/'}>{item.name}</a>