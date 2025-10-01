<script lang="ts">
	import type { Room } from '$lib/room';
	import MingIcon from '$lib/components/icons/MingIcon.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar';
	let { rooms }: { rooms: Room[] } = $props();
</script>

<Sidebar.Root variant="sidebar" collapsible="none">
	<Sidebar.Header>
		<Sidebar.MenuButton>
		<a href="/">Dashboard</a>
		</Sidebar.MenuButton>
	</Sidebar.Header>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Rooms</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each rooms as room}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								<a href="/rooms/{room.slug}">{room.name}</a>
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Data</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton>
							<a href="/">Stats</a>
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton>
							<a href="/">Logs</a>
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
					<Sidebar.MenuItem>
						<Sidebar.MenuButton>
							<a href="/">Settings</a>
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
</Sidebar.Root>
