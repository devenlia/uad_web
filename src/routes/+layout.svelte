<script lang="ts">
    import "../app.css";
    import { Menu } from "$lib/components/index";
    import ContentWizard from "$lib/modals/contentWizard";
    import DeleteConfirmation from "$lib/modals/deleteConfirmation";
    import { addToast, closeToast, Toasts } from "$lib/stores/toastStore";
    import IconParkOutlineClose from 'virtual:icons/icon-park-outline/close';

    let toasts : any;
    Toasts.subscribe((v) => {toasts = v});
</script>

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css2?family=Gabarito:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">

    <link rel="icon" href="/favicon.png" />
</svelte:head>

<div class="flex flex-row p-3 h-full overflow-hidden font-default">
    <Menu></Menu>
    <div class="ml-3 w-full" id="page">
        <slot />
    </div>
</div>

<!-- Modals -->
<ContentWizard/>
<DeleteConfirmation/>

<!-- Toasts -->
{#if (toasts?.length >= 1)}
    <div class="toast">
        {#each toasts as toast}
            <div class="alert" class:alert-error={toast.priority === 2} class:alert-info={toast.priority === 0}>
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{toast.message}</span>
                <button on:click={() => closeToast(toast.id)} class="btn btn-square btn-ghost btn-sm"><IconParkOutlineClose/></button>
            </div>
        {/each}
    </div>
{/if}
