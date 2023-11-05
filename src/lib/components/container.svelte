<script lang="ts">
  import type { Container} from "$lib/types";
  import { Category } from "$lib/components/index";
  import Catty from '$lib/assets/catty.svg'
  import IconParkOutlineMore from "virtual:icons/icon-park-outline/more-one";
  import IconParkOutlinePlus from 'virtual:icons/icon-park-outline/plus';
  import { openDeleteConfirmation } from "../modals/deleteConfirmation";
  import IconParkOutlineDelete from "virtual:icons/icon-park-outline/delete";
  import { addToast } from "$lib/stores/toastStore";
  import { invalidateAll } from "$app/navigation";
  import { openContentWizard } from "../modals/contentWizard";

  export let container : Container

  const deleteContainer = async () => {
    let body = new FormData()
    body.append("container", JSON.stringify(container))

    let res = await fetch("/actions/container/delete", {
      method: "POST",
      body
    });

    if (res.status != 200) {
      let statusText = await res.text();
      addToast({
        id: "",
        priority: 2,
        message: "Error while trying to deleteConfirmation a container! See console for more information."
      })
      console.log(`Error while trying to delete a container! Status: ${res.status} Message: ${statusText}`);
    }

    await invalidateAll()
  }
</script>

<div class="mt-5 border-2 border-gray-400 rounded-box">
  <div class="text-2xl bg-base-100 relative w-max px-3 py-1 rounded-box flex flex-row group" style="top: -20px; left: 20px">
    <h1>{container.name}</h1>
    <div class="dropdown ml-1">
      <label tabindex="0" class="btn btn-square btn-ghost btn-sm text-lg"><IconParkOutlineMore/></label>
      <ul tabindex="0" class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
        <li><button on:click={() => openDeleteConfirmation(deleteContainer)}><IconParkOutlineDelete/><span>Delete</span></button></li>
        <li><button on:click={() => openContentWizard("category", null, container.id)}><IconParkOutlinePlus/><span>Add a category</span></button></li>
      </ul>
    </div>
  </div>

  <div class="px-3 pb-3">
    {#each container.categories as category}
      <Category {category}/>
    {:else }
        <div class="flex flex-row h-20 w-full justify-center content-center">
          <div class="chat chat-end w-52 h-max">
            <div class="chat-bubble w-full chat-bubble-accent">
              <h2 class="text-lg font-bold whitespace-nowrap">Ups, no category!</h2>
              <button on:click={() => openContentWizard("category", null, container.id)} class="btn btn-outline text-white border-white hover:bg-white btn-sm w-max">Add one!</button>
            </div>
          </div>
          <img src={Catty} alt="Catty">
        </div>
    {/each}
  </div>
</div>