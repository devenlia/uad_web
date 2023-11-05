<script lang="ts">
  import type { Category } from "$lib/types";
  import { openAddModal } from "$lib/components/actions/add";
  import IconParkOutlineDelete from "virtual:icons/icon-park-outline/delete";
  import { openDeleteModal } from "$lib/components/actions/delete";
  import { addToast } from "$lib/stores/toastStore";
  import { invalidateAll } from "$app/navigation";

  export let category : Category;

  const deleteCategory = async () => {
    let body = new FormData()
    body.append("category", JSON.stringify(category))

    let res = await fetch("/actions/category/delete", {
      method: "POST",
      body
    });

    if (res.status != 200) {
      let statusText = await res.text();
      addToast({
        id: "",
        priority: 2,
        message: `Error while trying to delete the category '${category.name}'! See console for more information.`
      })
      console.log(`Error while trying to delete the category '${category.name}'! Status: ${res.status} Message: ${statusText}`);
    }

    await invalidateAll()
  }
</script>

<div class="collapse bg-base-200 {category.links.length > 0 ? 'collapse-arrow' : 'collapse-close'}">
  <input type="checkbox" />
  <div class="collapse-title text-xl font-medium flex flex-row justify-between">
    {category.name}

    {#if (category.links.length === 0)}
      <div class="flex content-center gap-x-1 relative" style="right: -30px">
        <button class="btn btn-sm btn-outline z-50" on:click={() => openAddModal("link", null, category.id)}>Add a link!</button>
        <button class="btn btn-sm btn-outline btn-square hover:btn-error z-50" on:click={() => openDeleteModal(deleteCategory)}><IconParkOutlineDelete/></button>
      </div>
    {:else}
      <button class="btn btn-sm btn-square z-50" on:click={() => openDeleteModal(deleteCategory)}><IconParkOutlineDelete/></button>
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