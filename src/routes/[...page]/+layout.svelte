<script lang="ts">
    import type { LayoutData } from './$types';
    import IconParkOutlinePlus from 'virtual:icons/icon-park-outline/plus';
    import IconParkOutlineMore from 'virtual:icons/icon-park-outline/more-one';
    import IconParkOutlineDelete from 'virtual:icons/icon-park-outline/delete';
    import { openContentWizard } from "$lib/modals/contentWizard";
    import { goto } from "$app/navigation";
    import { addToast } from "$lib/stores/toastStore";
    import { openDeleteConfirmation } from "$lib/modals/deleteConfirmation";

    export let data: LayoutData;

    const getPage = async (path: string) => {
        let res = await fetch(`http://localhost:8080/content/page/search?path=${path}`);

        if (res.status != 200) {
            let statusText = await res.text();
            addToast({id: "", priority: 2, message: "An error occurred while retrieving a page. Please refer to the console logs for further details."});
            console.error(`Failed to retrieve a page. Status: ${res.status}. Message: ${statusText}`);
        } else {
            return await res.json();
        }
    }

    const deletePage = async () => {
        let page = await getPage(data.path);
        if (!page) return;

        let headers = new Headers()
        headers.set("content-type", "application/json")

        let res = await fetch(`http://localhost:8080/content/page/delete?id=${page.id}`, {method: "DELETE"})

        if (res.status != 200) {
            let statusText = await res.text();
            addToast({id: "", priority: 2, message: `An error occurred while trying to delete the page '${page.name}'. Please check the console logs for more details.`});
            console.error(`Failed to delete the page ${page.name}. Status: ${res.status}. Message: ${statusText}`);
        }

        await goto("../")
    }
</script>

<header class="navbar bg-base-200 rounded-box w-full">
    <div class="flex-1">
        <div class="text-2xl breadcrumbs">
            <ul>
                {#if data.breadcrumbs && data.breadcrumbs.length > 1}
                    {#each data.breadcrumbs as breadcrumb}
                        <li><a href="{breadcrumb.href}" class="btn btn-sm btn-ghost normal-case text-lg !no-underline hover:text-primary">{breadcrumb.name}</a></li>
                    {/each}
                {:else}
                    <li><a href="/" class="btn btn-sm btn-ghost normal-case text-lg !no-underline hover:text-primary">Home</a>
                {/if}
            </ul>
        </div>
    </div>
    <div class="flex-none">
        <button on:click={() => openContentWizard("select", data.path)} class="btn btn-square btn-ghost text-lg"><IconParkOutlinePlus/></button>
        <div class="dropdown dropdown-end">
            <label tabindex="0" class="btn btn-square btn-ghost text-xl"><IconParkOutlineMore/></label>
            <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><button on:click={() => openDeleteConfirmation(deletePage)} class={data.path === "home" ? "btn-disabled" : ""}><IconParkOutlineDelete/><span>Delete</span></button></li>
            </ul>
        </div>
    </div>
</header>

<div class="overflow-y-auto">
    <div class="pt-3">
        <slot/>
    </div>
</div>