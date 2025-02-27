<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '@/components/ui/button';
	import { ICON_SIZE } from '@/constant';
	import { cn } from '@/utils';
	import { LockIcon, UserIcon } from 'lucide-svelte';
	import { cubicOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';

	type ProfileItems = {
		href: string;
		title: string;
		// harus any karena library lucide icon svelte
		// belum update ke svelte 5
		icon?: any;
	}[];

	const items: ProfileItems = [
		//
		{ href: '/profile', title: 'Profile', icon: UserIcon },
		{ href: '/profile/authentication', title: 'Authentication', icon: LockIcon }
	];

	let { children } = $props();

	const [send, receive] = crossfade({
		duration: 250,
		easing: cubicOut
	});
</script>

<div class="flex flex-col gap-2.5">
	<div class="flex flex-col gap-2.5 lg:flex-row">
		<aside class="w-1/5">
			<nav class="flex flex-row lg:flex-col gap-2.5">
				{#each items as item}
					{@const isActive = page.url.pathname === item.href}
					<Button
						href={item.href}
						variant="ghost"
						class={cn([
							!isActive && 'hover:underline',
							'relative justify-start hover:bg-transparent'
						])}
						data-sveltekit-noscroll
					>
						{#if isActive}
							<div
								class="absolute inset-0 rounded-md bg-muted"
								in:send={{ key: 'active-sidebar-tab' }}
								out:receive={{ key: 'active-sidebar-tab' }}
							></div>
						{/if}

						<div class="relative flex flex-row items-center gap-1">
							<item.icon size={ICON_SIZE}></item.icon>
							<span class="max-sm:hidden">{item.title}</span>
						</div>
					</Button>
				{/each}
			</nav>
		</aside>
		<div class="flex-1 lg:max-w-2xl">
			{@render children()}
		</div>
	</div>
</div>
