<script>
	import { AppBar } from "@skeletonlabs/skeleton-svelte";

</script>

<AppBar>
  {#snippet lead()}
    <strong class="text-xl uppercase">
        <sup class="-mr-2">ctrl</sup>
        <span class="-mr-2">+</span>
        <sub>esc</sub>
    </strong>
  {/snippet}
  {#snippet trail()}
  {/snippet}
</AppBar>