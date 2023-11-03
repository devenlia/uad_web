<script lang="ts">
  import { Action, Parent, Step, Visible } from "./store";
  import { onMount } from "svelte";
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
    if (visible && action == "category" && event.key === 'Enter') {
      proceed();
    }
  };

  let categoryName = "";

  let nameInvalid = false
  let invalidMessage : string | null = null

  let parent : any = {id: "0", name: "Home", path: "home"};
  Parent.subscribe(async (v) => {
    if (v)
      parent = v;
  });
  let parents : Promise<Array<any>> = loadParents();

  async function loadParents() {
    let res : Response;
    res = await fetch(`http://localhost:8080/content/page/search?path=${parent.path}`);

    if (res.status != 200) {
      throw error(res.status);
    }

    let parentPage = await res.json()
    parent = parentPage.containers[0];

    return parentPage.containers;
  }

  const validate = () => {
    categoryName = categoryName?.trim();
    if (categoryName == "") {
      nameInvalid = true
      invalidMessage = "Supply a name!"

      return false
    }
    else {
      nameInvalid = false
      invalidMessage = null

      return true
    }
  }

  const proceed = async () => {
    if (await validate()) {
      let body = new FormData()
      body.append("category", JSON.stringify({parent: parent.id, category: { name: categoryName } }))

      let res = await fetch("/actions/category/add", {
        method: "POST",
        body
      });

      let text = await res.text();

      if (res.status != 200) {
        nameInvalid = true
        invalidMessage = "Something went wrong! See console."
        console.log(`Error while trying to add a category! Status: ${res.status} Message: ${text}`);

        return
      }

      await invalidateAll()
      await closeModal()
    }
  }
</script>

<div class="w-full">
  <label class="label" for="parent">
    <span class="label-text">Select the <b>parent</b> of your new container:</span>
  </label>

  {#await parents}
    <select name="parent" class=" mb-3 select select-bordered select-disabled w-full">
      <option selected>Loading...</option>
    </select>
  {:then value}
    <select name="parent" bind:value={parent} class=" mb-3 select select-bordered w-full">
      {#each value as option}
        <option value={option}>{option.name}</option>
      {/each}
    </select>
  {/await}

  <label class="label" for="name">
    <span class="label-text">Give your container a <b>name</b>:</span>
  </label>
  <input on:input={validate} on:change={validate} name="name" type="text" placeholder="Name" class="input input-bordered w-full" class:input-error={nameInvalid} bind:value={categoryName}/>
  <label class="label" for="name">
    <span></span>
    {#if (invalidMessage != null)}
      <span class="label-text-alt text-error">{invalidMessage}</span>
    {/if}
  </label>

  <div class="flex flex-row justify-end gap-2">
    <button on:click={closeModal} class="btn btn-outline">Discard</button>
    <button on:click={proceed} class="btn btn-primary">Save and continue</button>
  </div>
</div>