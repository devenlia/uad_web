<script lang="ts">
  import type { Category } from "$lib/types";
  import { ExpandButton } from "$lib/components/";

  export let category : Category;
</script>

<div class="collapse bg-base-200 mt-3">
  <input type="radio" name="my-accordion-1"/>
  <div class="collapse-title collapse-arrow text-xl font-medium pr-4 flex flex-row justify-between">
    {category.name}

    <div class="z-50">
      <ExpandButton/>
    </div>
  </div>
  <div class="collapse-content">
    <div class="grid grid-cols-8 gap-3">
      {#each category.links as link}
        <a class="btn" href={link.href}>{link.name}</a>
      {/each}
    </div>
  </div>
</div>