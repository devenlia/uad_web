<script lang="ts">
  import { Action, Parent, Step, Visible } from "./store";
  import { onMount } from "svelte";
  import { error } from "@sveltejs/kit";
  import { closeContentWizard } from "$lib/modals/contentWizard/index";
  import { invalidateAll } from "$app/navigation";
  import { addToast } from "$lib/stores/toastStore";

  const handleKeyDown = (event: KeyboardEvent) => {
    if ($Visible && $Action == "container" && event.key === 'Enter') {
      proceed();
    }
  };

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  let containerName : string;
  let nameInvalid = false
  let invalidMessage : string | null = null
  let parentPage : any = $Parent.page;

  // Load parents
  let parentPages : Promise<Array<any>> = loadParents();

  async function loadParents() {
    let res : Response = await fetch(`http://localhost:8080/content/page/list`)

    if (res.status != 200) {
      await closeContentWizard();

      addToast({id: "", priority: 2, message: "An error occurred while initializing the wizard. Please check the console for more details."})
      console.error(`An error occurred while initializing the wizard. Status: ${res.status}, Message: ${await res.text()}`);

    }

    let pages = await res.json();
    parentPage = pages.find((obj : any) => obj.id === parentPage.id)

    return pages
  }

  // Check if container name is valid
  const isValidContainerName = () => {
    containerName = containerName?.trim();
    if (!containerName || containerName === "") {
      nameInvalid = true
      invalidMessage = "Supply a name!"
      return false
    }

    nameInvalid = false
    invalidMessage = null
    return true
  }

  const proceed = async () => {
    if (isValidContainerName()) {
      await addContainer()
      await invalidateAll()
      await closeContentWizard()
    }
  }

  const addContainer = async () => {
    let headers = new Headers()
    headers.set("content-type", "application/json")

    let res = await fetch("http://localhost:8080/content/container/add", {
      method: "POST",
      headers,
      body: JSON.stringify({ parentId: parentPage.id, name: containerName })
    })

    if (res.status !== 200 )  {
      let statusText = await res.text();
      addToast({id: "", priority: 2, message: `An error occurred while trying to add container '${containerName}'. Please check the console for detailed information.`})
      console.error(`Failed to add container '${containerName}'. Status: ${res.status}, Message: ${statusText}`);
    }
  }
</script>

<div class="w-full">
  <label class="label" for="parent">
    <span class="label-text">Select the <b>parent</b> of your new container:</span>
  </label>

  {#await parentPages}
    <select name="parent" class=" mb-3 select select-bordered select-disabled w-full">
      <option selected>{parentPage.name + " (" + parentPage.path.replaceAll(".", " > ") + ")"}</option>
    </select>
  {:then value}
    <select name="parent" bind:value={parentPage.id} class=" mb-3 select select-bordered w-full">
      {#each value as option}
        <option value={option.id}>{option.name + " (" + option.path.replaceAll(".", " > ") + ")"}</option>
      {/each}
    </select>
  {/await}

  <label class="label" for="name">
    <span class="label-text">Give your container a <b>name</b>:</span>
  </label>
  <input autofocus type="text" placeholder="Name" class="input input-bordered w-full" class:input-error={nameInvalid} bind:value={containerName}/>
  <label class="label" for="name">
    <span></span>
    {#if (invalidMessage != null)}
      <span class="label-text-alt text-error">{invalidMessage}</span>
    {/if}
  </label>

  <div class="flex flex-row justify-end gap-2">
    <button on:click={closeContentWizard} class="btn btn-outline">Discard</button>
    <button on:click={proceed} class="btn btn-primary">Save and continue</button>
  </div>
</div>