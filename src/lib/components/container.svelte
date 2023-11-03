<script lang="ts">
  import type { Container} from "$lib/types";
  import { Category } from "$lib/components/index";

  export let container : Container;
</script>

<div id={container.id} class="pb-5">
  <h1 class="text-2xl">{container.name}</h1>
  {#each container.categories as category}
    <Category {category}/>
  {/each}
</div>