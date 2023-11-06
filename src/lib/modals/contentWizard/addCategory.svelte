<script lang="ts">
  import { Action, Parent, Step, Visible } from "./store";
  import { onMount } from "svelte";
  import { error } from "@sveltejs/kit";
  import { closeContentWizard } from "$lib/modals/contentWizard/index";
  import { invalidateAll } from "$app/navigation";
  import { addToast } from "$lib/stores/toastStore";

  const handleKeyDown = (event: KeyboardEvent) => {
    if ($Visible && $Action == "category" && event.key === 'Enter') {
      proceed();
    }
  };

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  let categoryName = "";
  let containerInvalid = false
  let containerInvalidMessage : string | null = null
  let nameInvalid = false
  let nameInvalidMessage : string | null = null

  let parentPage : any = $Parent.page;
  let parentPages : Promise<Array<any>> = loadParentPages();

  let parentContainer : any = $Parent.container;
  let parentContainers : any = parentPage.containers;
  

  async function loadParentPages() {
    let res : Response = await fetch(`http://localhost:8080/content/page/list`)

    if (res.status != 200) {
      await closeContentWizard();

      addToast({id: "", priority: 2, message: "An error occurred while initializing the wizard. Please check the console for more details."})
      console.error(`An error occurred while initializing the wizard. Status: ${res.status}, Message: ${await res.text()}`);

    }

    let pages = await res.json();
    parentPage = pages.find((obj : any) => obj.id === parentPage.id)
    changeParentPage()

    return pages
  }

  const changeParentPage = () => {
    parentContainers = parentPage.containers
    parentContainer = parentPage.containers.find((obj : any) => obj.id === parentContainer?.id) ?? parentPage.containers[0]
  }

  const isValidParentContainer = () => {
    if (!parentContainer) {
      containerInvalid = true
      containerInvalidMessage = "No container!"
      return false
    }

    containerInvalid = false
    containerInvalidMessage = null
    return true;
  }

  const isValidCategoryName = () => {
    categoryName = categoryName?.trim();
    if (categoryName == "") {
      nameInvalid = true
      nameInvalidMessage = "Supply a name!"
      return false
    }

    nameInvalid = false
    nameInvalidMessage = null
    return true
  }

  const proceed = async () => {
    if (isValidCategoryName() && isValidParentContainer()) {
      await addCategory()
      await invalidateAll()
      await closeContentWizard()
    }
  }

  const addCategory = async () => {
    let headers = new Headers()
    headers.set("content-type", "application/json")

    let res = await fetch("http://localhost:8080/content/category/add", {
      method: "POST",
      headers,
      body: JSON.stringify({ parentId: parentContainer.id, name: categoryName })
    })

    if (res.status !== 200 )  {
      let statusText = await res.text();
      addToast({id: "", priority: 2, message: `An error occurred while trying to add category '${categoryName}'. Please check the console for detailed information.`})
      console.error(`Failed to add category '${categoryName}'. Status: ${res.status}, Message: ${statusText}`);
    }
  }
</script>

<div class="w-full">
  <label class="label" for="parentPage">
    <span class="label-text">Select the <b>parent page</b> of your new container:</span>
  </label>
  {#await parentPages}
    <select disabled name="parentPage" class=" mb-3 select select-bordered select-disabled w-full">
      <option selected>{parentPage.name + " (" + parentPage.path?.replaceAll(".", " > ") + ")"}</option>
    </select>
  {:then values}
    <select disabled={values.length <= 1} name="parentPage" bind:value={parentPage} on:change={changeParentPage} class=" mb-3 select select-bordered w-full">
      {#each values as option}
        <option value={option}>{option.name + " (" + option.path.replaceAll(".", " > ") + ")"}</option>
      {/each}
    </select>
  {/await}

  <label class="label" for="parentCont">
    <span class="label-text">Select the <b>parent container</b> of your new container:</span>
  </label>
  <select name="parentCont" disabled={parentContainers.length <= 1} bind:value={parentContainer} class=" mb-3 select select-bordered w-full" class:select-error={containerInvalid}>
    {#each parentContainers as option}
      <option value={option}>{option.name}</option>
    {/each}
  </select>
  <label class="label" for="parentCont">
    <span></span>
    {#if (containerInvalidMessage != null)}
      <span class="label-text-alt text-error">{containerInvalidMessage}</span>
    {/if}
  </label>

  <label class="label" for="name">
    <span class="label-text">Give your container a <b>name</b>:</span>
  </label>
  <input autofocus name="name" type="text" placeholder="Name" class="input input-bordered w-full" class:input-error={nameInvalid} bind:value={categoryName}/>
  <label class="label" for="name">
    <span></span>
    {#if (nameInvalidMessage != null)}
      <span class="label-text-alt text-error">{nameInvalidMessage}</span>
    {/if}
  </label>

  <div class="flex flex-row justify-end gap-2">
    <button on:click={closeContentWizard} class="btn btn-outline">Discard</button>
    <button on:click={proceed} class="btn btn-primary">Save and continue</button>
  </div>
</div>