<script>
	import * as NavigationMenu from '$lib/components/ui/navigation-menu'
	import MingIcon from '../icons/MingIcon.svelte';

</script>

<NavigationMenu.Root class="h-10">
  <NavigationMenu.List>
    <NavigationMenu.Item>
      <div class="grid grid-cols-2 grid-rows-2 items-center">
        <span class="block row-span-2 icon-[mingcute--lock-fill] w-7 h-7 text-zinc-700 scale-x-90"></span>
        <span class="text-sm leading-0 mt-2 -ml-0.5">ctrl</span>
        <span class="text-sm leading-0 -ml-0.5">esc</span>
      </div>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu.Root>