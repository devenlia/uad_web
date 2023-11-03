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
    if (visible && action == "link" && event.key === 'Enter') {
      proceed();
    }
  };

  let linkName = "";
  let href = "";

  let nameInvalid = false
  let hrefInvalid = false
  let invalidMessage : string | null = null
  let hrefInvalidMessage : string | null = null

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
    parent = parentPage.containers[0].categories[0];

    console.log(parentPage.containers);

    return parentPage.containers;
  }

  const validate = () => {
    return !(validateName() == false || validateHREF() == false);
  }

  const validateName = () => {
    linkName = linkName?.trim();
    if (linkName == "") {
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

  const validateHREF = () => {
    href = href?.trim();
    if (href == "") {
      hrefInvalid = true
      hrefInvalidMessage = "Supply a location!"

      return false
    }
    else {
      hrefInvalid = false
      hrefInvalidMessage = null

      return true
    }
  }

  const proceed = async () => {
    if (validate()) {
      let body = new FormData()
      body.append("link", JSON.stringify({parent: parent.id, link: { name: linkName, href } }))

      let res = await fetch("/actions/link/add", {
        method: "POST",
        body
      });

      let text = await res.text();

      if (res.status != 200) {
        hrefInvalidMessage = "Something went wrong! See console."
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
    <span class="label-text">Select a <b>category</b> in which your new link should be:</span>
  </label>

  {#await parents}
    <select disabled name="parent" class=" mb-3 select select-bordered select-disabled w-full">
      <option selected>Loading...</option>
    </select>
  {:then value}
    <select name="parent" bind:value={parent} class=" mb-3 select select-bordered w-full">
      {#each value as option}
        {#if option.categories?.length >= 1}
          {#each option.categories as cat}
            <option value={cat}>{cat.name + " in " + option.name}</option>
          {/each}
        {/if}
      {/each}
    </select>
  {/await}

  <label class="label" for="name">
    <span class="label-text">Give your link a <b>name</b>:</span>
  </label>
  <input on:input={validateName} on:change={validateName} name="name" type="text" placeholder="Name" class="input input-bordered w-full" class:input-error={nameInvalid} bind:value={linkName}/>
  <label class="label" for="name">
    <span></span>
    {#if (invalidMessage != null)}
      <span class="label-text-alt text-error">{invalidMessage}</span>
    {/if}
  </label>

  <label class="label" for="name">
    <span class="label-text">Specify the <b>destination</b> of your link:</span>
  </label>
  <div class="flex flex-row gap-1.5">
    <!--<select name="parent" class="w-28 mb-3 select select-bordered w-full">
      <option selected>https://</option>
      <option>http://</option>
    </select>-->
    <input on:input={validateHREF} on:change={validateHREF} name="href" type="text" placeholder="HREF" class="input input-bordered w-full" class:input-error={hrefInvalid} bind:value={href}/>
  </div>
  <label class="label" for="name">
    <span></span>
    {#if (hrefInvalidMessage != null)}
      <span class="label-text-alt text-error">{hrefInvalidMessage}</span>
    {/if}
  </label>

  <div class="flex flex-row justify-end gap-2">
    <button on:click={closeModal} class="btn btn-outline">Discard</button>
    <button on:click={proceed} class="btn btn-primary">Save and continue</button>
  </div>
</div>