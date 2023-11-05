<script lang="ts">
  import { onMount } from 'svelte';
  import { Action, Parent, Visible } from './store';
  import { error } from '@sveltejs/kit';
  import { closeAddModal } from '$lib/components/actions/add/index';
  import { invalidateAll } from '$app/navigation';
  import { addToast } from "$lib/stores/toastStore";

  const handleKeyDown = (event: KeyboardEvent) => {
    if ($Visible && $Action === 'page' && event.key === 'Enter') {
      proceed();
    }
  };

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  let pageName : string;
  let nameInvalid = false;
  let invalidMessage : string | null = null;
  let parentPage : any = $Parent.page;

  const nameToPath = (name : string) : string => {
    return name.toLowerCase().replaceAll(/\u00fc/g, 'ue').replaceAll(/\u00f6/g, 'oe').replaceAll(/\u00e4/g, 'ae').replaceAll(/\u00df/g, 'ss').replaceAll(/\s/g, "");
  }

  $: path = parentPage.path + '.' + (pageName ? nameToPath(pageName) : 'newPage')

  // Load parents
  let parentPages : Promise<Array<any>> = loadParentPages();

  async function loadParentPages() {
    let res : Response = await fetch(`http://localhost:8080/content/page/list`)

    if (res.status != 200) {
      await closeAddModal();

      addToast({id: "", priority: 2, message: "An error occurred while initializing the wizard. Please check the console for more details."})
      console.error(`An error occurred while initializing the wizard. Status: ${res.status}, Message: ${await res.text()}`);

    }

    let pages = await res.json();
    parentPage = pages.find((obj : any) => obj.id === parentPage.id)

    return pages
  }

  // Check if page name is valid
  const isValidPageName = async () => {
    pageName = pageName?.trim();
    if (!pageName || pageName === "")  {
      nameInvalid = true
      invalidMessage = "Supply a name!"
      return false
    }

    let foundPage = (await parentPages).find((obj:any) => obj.path === path);
    if (foundPage != null)  {
      nameInvalid = true
      invalidMessage = "Name already taken!"
      return false
    }

    nameInvalid = false
    invalidMessage = null
    return true
  }

  // Proceeds add page
  const proceed = async () => {
    if (await isValidPageName()) {
      await addPage();
      await invalidateAll();
      await closeAddModal()
    }
  }

  const addPage = async() => {
    let body = new FormData();
    body.append("page", JSON.stringify({name: pageName, path: path}));

    let res = await fetch("/actions/page/add", { method: "POST", body });
    let resText = await res.text();
    if ((res.status === 400 && resText === "Page name already taken") || res.status !== 200 )  {
      nameInvalid = true
      invalidMessage = ((res.status === 400 && resText === "Page name already taken") ? "Name already taken!" : "Something went wrong! See console.");
      console.error(`Error while trying to add a page! Status: ${res.status} Message: ${resText}`)
    }
  }
</script>

<div class="w-full">
  <label class="label" for="parent">
    <span class="label-text">Select the <b>parent</b> of your new page:</span>
  </label>

  {#await parentPages}
    <select disabled name="parent" class=" mb-3 select select-bordered select-disabled w-full">
      <option selected>{parentPage.name + " (" + parentPage.path?.replaceAll(".", " > ") + ")"}</option>
    </select>
  {:then values}
    <select disabled={values.length <= 1} name="parent" bind:value={parentPage} class=" mb-3 select select-bordered w-full">
    {#each values as option}
        <option value={option}>{option.name + " (" + option.path.replaceAll(".", " > ") + ")"}</option>
    {/each}
    </select>
  {/await}

  <label class="label" for="name">
    <span class="label-text">Give your page a <b>name</b>:</span>
  </label>
  <input autofocus type="text" placeholder="Name" class="input input-bordered w-full" class:input-error={nameInvalid} bind:value={pageName}/>
  <label class="label" for="name">
    <span class="label-text-alt">Path will be: {path}</span>
    {#if (invalidMessage != null)}
      <span class="label-text-alt text-error">{invalidMessage}</span>
    {/if}
  </label>

  <div class="flex flex-row justify-end gap-2">
    <button on:click={closeAddModal} class="btn btn-outline">Discard</button>
    <button on:click={proceed} class="btn btn-primary">Save and continue</button>
  </div>
</div>