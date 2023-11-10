<script lang="ts">
  import { Action, Parent, Step, Visible } from "./store";
  import { onMount } from "svelte";
  import { error } from "@sveltejs/kit";
  import { closeContentWizard } from "$lib/modals/contentWizard/index";
  import { invalidateAll } from "$app/navigation";
  import { addToast } from "$lib/stores/toastStore";
  import validator from 'validator';

  const handleKeyDown = (event: KeyboardEvent) => {
    if ($Visible && $Action == "link" && event.key === 'Enter') {
      proceed();
    }
  };

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  let linkName = "";
  let href = "";
  let containerInvalid = false
  let containerInvalidMessage : string | null = null
  let categoryInvalid = false
  let categoryInvalidMessage : string | null = null
  let nameInvalid = false
  let nameInvalidMessage : string | null = null
  let hrefInvalid = false
  let hrefInvalidMessage : string | null = null

  let parentPage : any = $Parent.page;
  let parentPages : Promise<Array<any>> = loadParentPages();

  let parentContainer : any = $Parent.container;
  let parentContainers : any = parentPage.containers;

  let parentCategory : any = $Parent.category;
  let parentCategories : any = parentPage.containers;

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

    parentCategories = parentContainer.categories
    parentCategory = parentContainer.categories.find((obj : any) => obj.id === parentCategory?.id) ?? parentContainer.categories[0]
  }

  const changeParentContainer = () => {
    parentCategories = parentContainer.categories
    parentCategory = parentContainer.categories.find((obj : any) => obj.id === parentCategory?.id) ?? parentContainer.categories[0]
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

  const isValidParentCategory = () => {
    if (!parentCategory) {
      categoryInvalid = true
      categoryInvalidMessage = "No category!"
      return false
    }

    categoryInvalid = false
    categoryInvalidMessage = null
    return true;
  }

  const isValidLinkName = () => {
    linkName = linkName?.trim();
    if (linkName == "") {
      nameInvalid = true
      nameInvalidMessage = "Supply a name!"

      return false
    }

    nameInvalid = false
    nameInvalidMessage = null
    return true
  }

  const isValidLinkHref = () => {
    href = href?.trim();
    if (href == "") {
      hrefInvalid = true
      hrefInvalidMessage = "Supply a location!"

      return false
    }

    if (!validator.isURL(href)) {
      hrefInvalid = true
      hrefInvalidMessage = "Must be a valid link! (http://example.com)"

      return false
    }

    hrefInvalid = false
    hrefInvalidMessage = null
    return true
  }

  const validateAll = () => {
    return isValidParentContainer() && isValidParentCategory() && isValidLinkName() && isValidLinkHref();
  }

  const proceed = async () => {
    if (validateAll()) {
      await addLink()
      await invalidateAll()
      await closeContentWizard()
    }
  }

  const addLink = async () => {
    const formData = new FormData();
    formData.append("type", 'link')
    formData.append("name", linkName)
    formData.append("parentID", parentCategory.id)
    formData.append("href", href)


    await fetch("/?/add", { method: 'POST', body: formData })
  }
</script>

<div class="w-full">
  <label class="label" for="parentPage">
    <span class="label-text">Select the <b>parent page</b> of your new link:</span>
  </label>
  {#await parentPages}
    <select disabled name="parentPage" class=" mb-3 select select-bordered select-disabled w-full">
      <option selected>{parentPage.name + " (" + parentPage.path?.replaceAll(".", " > ") + ")"}</option>
    </select>
  {:then values}
    <select disabled={values.length <= 1} name="parentPage" bind:value={parentPage} on:change={changeParentPage}
            class=" mb-3 select select-bordered w-full">
      {#each values as option}
        <option value={option}>{option.name + " (" + option.path.replaceAll(".", " > ") + ")"}</option>
      {/each}
    </select>
  {/await}

  <label class="label" for="parentCont">
    <span class="label-text">Select the <b>parent container</b> of your new link:</span>
  </label>
  <select name="parentCont" disabled={parentContainers.length <= 1} bind:value={parentContainer} on:change={changeParentContainer}
          class=" mb-3 select select-bordered w-full" class:select-error={containerInvalid}>
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

  <label class="label" for="parentCat">
    <span class="label-text">Select the <b>parent category</b> of your new link:</span>
  </label>
  <select name="parentCat" disabled={parentCategories.length <= 1} bind:value={parentCategory}
          class=" mb-3 select select-bordered w-full" class:select-error={categoryInvalid}>
    {#each parentCategories as option}
      <option value={option}>{option.name}</option>
    {/each}
  </select>
  <label class="label" for="parentCat">
    <span></span>
    {#if (categoryInvalidMessage != null)}
      <span class="label-text-alt text-error">{categoryInvalidMessage}</span>
    {/if}
  </label>

  <label class="label" for="name">
    <span class="label-text">Give your link a <b>name</b>:</span>
  </label>
  <input autofocus name="name" type="text" placeholder="Name" class="input input-bordered w-full" class:input-error={nameInvalid} bind:value={linkName}/>
  <label class="label" for="name">
    <span></span>
    {#if (nameInvalidMessage != null)}
      <span class="label-text-alt text-error">{nameInvalidMessage}</span>
    {/if}
  </label>

  <label class="label" for="href">
    <span class="label-text">Specify the <b>destination</b> of your link:</span>
  </label>
  <div class="flex flex-row gap-1.5">
    <!--<select name="parent" class="w-28 mb-3 select select-bordered w-full">
      <option selected>https://</option>
      <option>http://</option>
    </select>-->
    <input name="href" type="text" placeholder="HREF" class="input input-bordered w-full" class:input-error={hrefInvalid} bind:value={href}/>
  </div>
  <label class="label" for="href">
    <span></span>
    {#if (hrefInvalidMessage != null)}
      <span class="label-text-alt text-error">{hrefInvalidMessage}</span>
    {/if}
  </label>

  <div class="flex flex-row justify-end gap-2">
    <button on:click={closeContentWizard} class="btn btn-outline">Discard</button>
    <button on:click={proceed} class="btn btn-primary">Save and continue</button>
  </div>
</div>