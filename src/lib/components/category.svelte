<script lang="ts">
  import type { Category } from "$lib/types";
  import { openContentWizard } from "../modals/contentWizard";
  import IconParkOutlineDelete from "virtual:icons/icon-park-outline/delete";
  import { openDeleteConfirmation } from "../modals/deleteConfirmation";
  import { addToast } from "$lib/stores/toastStore";
  import { invalidateAll } from "$app/navigation";

  export let category : Category;

  const deleteCategory = async () => {
    let headers = new Headers()
    headers.set("content-type", "application/json")

    let res = await fetch(`http://localhost:8080/content/category/delete?id=${category.id}`, {
      method: "DELETE",
      headers
    })

    if (res.status != 200) {
      let statusText = await res.text();
      addToast({id: "", priority: 2, message: `An error occurred while attempting to delete category '${category.name}'. More details are available in console.`})
      console.error(`An error occurred while attempting to delete category '${category.name}'. Status: ${res.status}, Message: ${statusText}.`);    }

    await invalidateAll();
  }
</script>

<div class="collapse bg-base-200 {category.links.length > 0 ? 'collapse-arrow' : 'collapse-close'}">
  <input type="checkbox" />
  <div class="collapse-title text-xl font-medium flex flex-row justify-between">
    {category.name}

    {#if (category.links.length === 0)}
      <div class="flex content-center gap-x-1 relative" style="right: -30px">
        <button class="btn btn-sm btn-outline z-50" on:click={() => openContentWizard("link", null, category.id)}>Add a link!</button>
        <button class="btn btn-sm btn-outline btn-square hover:btn-error z-50" on:click={() => openDeleteConfirmation(deleteCategory)}><IconParkOutlineDelete/></button>
      </div>
    {:else}
      <button class="btn btn-sm btn-square z-50" on:click={() => openDeleteConfirmation(deleteCategory)}><IconParkOutlineDelete/></button>
    {/if}
  </div>
  <div class="collapse-content">
    <div class="grid grid-cols-8 gap-3">
      {#each category.links as link}
        <a target="_blank" class="btn" href={link.href}>{link.name}</a>
      {/each}
    </div>
  </div>
</div>