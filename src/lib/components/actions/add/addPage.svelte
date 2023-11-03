<script lang="ts">
  import { Step, Parent, Action, Visible } from "./store";
  import { onMount } from 'svelte';
  import type { Page } from "$lib/types";
  import { error } from "@sveltejs/kit";
  import { closeModal } from "$lib/components/actions/add/index";
  import { invalidateAll } from "$app/navigation";

  let action : string;
  Action.subscribe((v) => {action = v});

  let visible : boolean;
  Visible.subscribe((v) => {visible = v});

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  const handleKeyDown = (event: KeyboardEvent) => {
    if (visible && action == "page" && event.key === 'Enter') {
      proceed();
    }
  };

  let pageName = "";
  $: path = parent.path + '.' + (pageName ? pageName.toLowerCase().replace(/\u00fc/g, 'ue').replace(/\u00f6/g, 'oe').replace(/\u00e4/g, 'ae').replace(/\u00df/g, 'ss') : "newPage")

  let nameInvalid = false
  let invalidMessage : string | null = null

  let parents : Promise<Array<any>> = loadParents();
  let parent : any = {id: "0", name: "Home", path: "home"};
  Parent.subscribe(async (v) => {
    if (v)
      parent = v;
  });

  async function loadParents() {
    let res : Response;
    res = await fetch(`http://localhost:8080/content/page/list`);

    if (res.status != 200) {
      throw error(res.status);
    }

    let json = await res.json();

    parent = json.find((obj : any) => obj.path === (parent.path ?? "0"));

    return json;
  }

  const validate = async () => {
    pageName = pageName?.trim();
    if (pageName == "") {
      nameInvalid = true
      invalidMessage = "Supply a name!"

      return false
    } else if ((await parents).find((obj : any) => obj.path === path) != null) {
      nameInvalid = true
      invalidMessage = "Name already taken!"

      return false
    } else {
      nameInvalid = false
      invalidMessage = null

      return true
    }
  }

  const proceed = async () => {
    if (await validate()) {
      let body = new FormData()
      body.append("page", JSON.stringify({name: pageName, path: path}))

      let res = await fetch("/actions/page/add", {
        method: "POST",
        body
      });

      if (res.status == 400 && await res.text() == "Page name already taken") {
        nameInvalid = true
        invalidMessage = "Name already taken!"
      }
      else if (res.status != 200) {
        nameInvalid = true
        invalidMessage = "Something went wrong! See console."
        let statusText = await res.text();
        console.log(`Error while trying to add a page! Status: ${res.status} Message: ${statusText}`);
      }

      await invalidateAll()
      await closeModal()
    }
  }
</script>

<div class="w-full">
  <label class="label" for="parent">
    <span class="label-text">Select the <b>parent</b> of your new page:</span>
  </label>

  {#await parents}
    <select name="parent" class=" mb-3 select select-bordered select-disabled w-full">
      <option selected>{parent.path}</option>
    </select>
  {:then value}
    <select name="parent" bind:value={parent} class=" mb-3 select select-bordered w-full">
    {#each value as option}
        <option value={option}>{option.name + " (" + option.path.replaceAll(".", " > ") + ")"}</option>
    {/each}
    </select>
  {/await}

  <label class="label" for="name">
    <span class="label-text">Give your page a <b>name</b>:</span>
  </label>
  <input on:input={validate} on:change={validate} name="name" type="text" placeholder="Name" class="input input-bordered w-full" class:input-error={nameInvalid} bind:value={pageName}/>
  <label class="label" for="name">
    <span class="label-text-alt">Path will be: {path}</span>
    {#if (invalidMessage != null)}
      <span class="label-text-alt text-error">{invalidMessage}</span>
    {/if}
  </label>

  <div class="flex flex-row justify-end gap-2">
    <button on:click={closeModal} class="btn btn-outline">Discard</button>
    <button on:click={proceed} class="btn btn-primary">Save and continue</button>
  </div>
</div>