<script lang="ts">
	import type { UINotification } from '.';
	import { NotificationType } from '.';
	import 'iconify-icon';

	export let notification: UINotification;
	export let visible: boolean = true;

	const { type, dismissable, content, redirectTarget } = notification;
	const actions = content.actions ?? [];

	let bgVariant = 'variant-ghost-surface';
	let icon = 'mingcute:bell-ringing-fill';
	switch (notification.type) {
		case NotificationType.INFO:
			bgVariant = 'variant-ghost-surface';
			icon = 'mingcute:bell-ringing-fill';
			break;
		case NotificationType.SUCCESS:
			bgVariant = 'variant-ghost-success';
			icon = 'mingcute:check-circle-fill';
			break;
		case NotificationType.WARN:
			bgVariant = 'variant-ghost-warning';
			icon = 'mingcute:alert-fill';
			break;
		case NotificationType.ERROR:
			bgVariant = 'variant-ghost-error';
			icon = 'mingcute:alert-octagon-fill';
			break;
	}
</script>

{#if visible}
	<div
		class="{bgVariant} rounded-md px-3 py-2 flex flex-row gap-2 transition-transform duration-75 {redirectTarget &&
			'hover:scale-105 '} backdrop-blur-lg"
	>
		<a
			class="flex flex-row items-center gap-4 grow
                {redirectTarget ? 'cursor-pointer' : 'cursor-default'}"
			href={redirectTarget ?? '#'}
		>
			<iconify-icon class="text-xl grow-0" {icon} />
			<!-- Message -->
			<div class="grow">
				<p class="text-base">{content.message}</p>
			</div>
			<!-- Actions -->
			<div class="grow-0">
				{#each actions as action}
					<button class="btn btn-sm {bgVariant} flex flex-col justify-center bg-initial">
						<iconify-icon icon={action.icon} />
						{action.text}
					</button>
				{/each}
			</div>
		</a>
		{#if dismissable}
			<button
				type="button"
				class="flex flex-col justify-center bg-initial"
				on:click={() => notification.dismissToast()}
			>
				<iconify-icon icon="mingcute:close-fill" />
			</button>
		{/if}
	</div>
{/if}
