<script lang="ts">
    import { page } from '$app/stores';

    console.log($page)
</script>

<div class="navbar bg-base-200 rounded-box">
    <div class="navbar-start">
        lul
    </div>
    <div class="navbar-center">
        <p class="text-5xl font-bold">{$page.status}</p>
    </div>
</div>