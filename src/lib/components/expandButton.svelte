<script lang="ts">
  import IconParkOutlineMore from 'virtual:icons/icon-park-outline/more-one';
  import IconParkOutlineClose from 'virtual:icons/icon-park-outline/close';
  import IconParkOutlineDelete from 'virtual:icons/icon-park-outline/delete';
  import IconParkOutlineEdit from 'virtual:icons/icon-park-outline/align-text-center-one';
  import IconParkOutlineWrite from 'virtual:icons/icon-park-outline/write';

  export let expanded = false;

</script>

<div class="h-8 rounded-lg flex flex-row align-middle justify-end overflow-hidden {expanded ? 'bg-base-100' : 'w-8'}">
  <button class="btn btn-square btn-sm text-lg btn-ghost hover:text-red-600">
    <IconParkOutlineDelete/>
  </button>

  <label class="swap btn btn-square btn-sm text-lg btn-ghost z-50 hover:text-primary">
    <input type="checkbox" bind:checked={expanded}/>
    <IconParkOutlineMore class="swap-off fill-current"/>

    <IconParkOutlineClose class="swap-on fill-current"/>
  </label>
</div>