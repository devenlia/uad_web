<script lang="ts">
  import type { PageData } from './$types';
  import { SubpageCard, Container } from "$lib/components";
  import { SadCat } from "$lib/assets";
  import { openAddModal } from "$lib/components/actions/add";
  import { addToast } from "$lib/stores/toastStore";

  export let data : PageData;
</script>

<base href={data.basePath}/>

{#if (data.page.subpages.length !== 0)}
  <div class="grid grid-cols-4 gap-3">
    {#each data.page.subpages as subpage}
      <SubpageCard subpage={subpage}/>
    {/each}
  </div>

  <div class="divider text-accent"></div>
{/if}

{#if (data.page.containers.length !== 0)}
  {#each data.page.containers as container}
    <Container {container}/>
  {/each}
{:else}
  <div class="h-full w-full flex justify-center content-center">
    <div class="mt-40 h-min flex flex-row content-center">
      <div class="w-96">
        <h1 class="text-7xl">Welcome to UAD</h1>
        <p class="text-xl mb-10">Your new Unified Application Directory</p>

        <button on:click={() => openAddModal("container", data.page, true)} class="btn btn-outline">Start to add your first link!</button>
        <button on:click={() => {}} class="btn btn-primary">Take a tour.</button>
      </div>
      <div class="w-96">
        <img src="{SadCat}" alt="SadCat">
      </div>
    </div>
  </div>
{/if}