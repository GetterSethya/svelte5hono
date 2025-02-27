<script lang="ts" module>
	export { UserAvatar };
</script>

<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import Moon from 'lucide-svelte/icons/moon';
	import Sun from 'lucide-svelte/icons/sun';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import LogOut from 'lucide-svelte/icons/log-out';
	import { setMode, mode } from 'mode-watcher';
	import { logoutMutation } from '@/mutation/logout';
	import { Client } from '@/client';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { buttonVariants } from './ui/button';
	import { LocalUser } from '@/local-user';
	import { type UserEntity } from '@root/lib/repository/user-repository';
	import { UserIcon } from 'lucide-svelte';
	import { ICON_SIZE } from '@/constant';

	const sidebar = useSidebar();
	const client = Client.getCtx();
	const mutation = logoutMutation(client);
	const user = LocalUser.getCtx();
</script>

{#snippet UserAvatar({ user }: { user: UserEntity })}
	<Avatar.Root class="h-8 w-8 rounded-lg">
		<Avatar.Fallback class="rounded-lg">{user.name.substring(0, 2)}</Avatar.Fallback>
	</Avatar.Root>
	<div class="grid flex-1 text-left text-sm leading-tight">
		<span class="truncate font-semibold">{user.name}</span>
		<span class="truncate text-xs">{user.email}</span>
	</div>
{/snippet}

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						{...props}
					>
						{@render UserAvatar({ user: $user })}
						<ChevronsUpDown class="ml-auto size-4" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-[--bits-dropdown-menu-anchor-width] min-w-56 rounded-lg"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				align="end"
				sideOffset={4}
			>
				<DropdownMenu.Label class="p-0 font-normal">
					<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
						{@render UserAvatar({ user: $user })}
					</div>
				</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item onclick={()=>goto("/profile")}>
						<UserIcon class="mr-2 size-4"/>
						<span>Profile</span>
					</DropdownMenu.Item>
					<DropdownMenu.Sub>
						<DropdownMenu.SubTrigger>
							{#if $mode === 'dark'}
								<Moon class="mr-2 size-4" />
							{:else if $mode === 'light'}
								<Sun class="mr-2 size-4" />
							{/if}
							<span>Theme</span>
						</DropdownMenu.SubTrigger>
						<DropdownMenu.SubContent>
							<DropdownMenu.Item onclick={() => setMode('light')}>
								<Sun class="mr-2 size-4" />
								<span>Light</span>
							</DropdownMenu.Item>
							<DropdownMenu.Item onclick={() => setMode('dark')}>
								<Moon class="mr-2 size-4" />
								<span>Dark</span>
							</DropdownMenu.Item>
						</DropdownMenu.SubContent>
					</DropdownMenu.Sub>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Item
					class={buttonVariants({
						size: 'sm',
						variant: 'destructive',
						class: 'w-full cursor-pointer'
					})}
					disabled={$mutation.isPending}
					onclick={() => {
						$mutation.mutate(undefined, {
							onSuccess: () => {
								toast.success('Logout');
								goto('/login');
							}
						});
					}}
				>
					<LogOut />
					Log out
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
