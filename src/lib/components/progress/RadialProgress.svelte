<script lang="ts">
  import { cn } from '$lib/utils';

  let { value = 0, max = 100, size = 24, strokeWidth = 6, class: className = '' } = $props();

  let normalizedRadius = $derived(size / 2 - strokeWidth / 2);
  let circumference = $derived(normalizedRadius * 2 * Math.PI);
  let progress = $derived(Math.min((value ?? 0) / max, 1) * circumference);
</script>

<svg
  class={cn('transition-all', className)}
  width={size}
  height={size}
  viewBox={`0 0 ${size} ${size}`}
  shape-rendering="geometricPrecision" 
>
  <!-- Background circle -->
  <circle
    class="stroke-muted stroke-background/20"
    cx={size / 2}
    cy={size / 2}
    r={normalizedRadius}
    stroke-width={strokeWidth}
    fill="none"
  />
  <!-- Progress circle -->
  <circle
    class="stroke-primary transition-all origin-center"
    cx={size / 2}
    cy={size / 2}
    r={normalizedRadius}
    stroke-width={strokeWidth}
    fill="none"
    stroke-dasharray={circumference}
    stroke-dashoffset={circumference - progress}
    stroke-linecap="round"
    transform={`rotate(270)`}
  />
</svg>