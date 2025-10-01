<script lang="ts">
    let {icon, size = "md"}: {
        icon: string,
        size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
    } = $props();
    const sizeMapping = {
        "2xs": "w-2 h-2",
        "xs": "w-3 h-3",
        "sm": "w-4 h-4",
        "md": "w-5 h-5",
        "lg": "w-6 h-6",
        "xl": "w-8 h-8",
        "2xl": "w-10 h-10",
        "3xl": "w-12 h-12",
        "4xl": "w-16 h-16",
        "5xl": "w-20 h-20",
        "6xl": "w-24 h-24",
    }
</script>

<span class="icon-[mingcute--{icon}] {sizeMapping[size]} flex justify-center"></span>