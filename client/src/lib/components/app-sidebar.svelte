<script lang="ts" module>
	const data = {
		navMain: [
			{
				title: 'Tracker',
				url: '#',
				icon: BriefcaseIcon,
				isActive: true,
				items: [
					{
						title: 'Application',
						url: '/'
					},
					{
						title: 'Company',
						url: '/company'
					},
				]
			}
		]
	};
</script>

<script lang="ts">
	import NavMain from '$lib/components/nav-main.svelte';
	import NavUser from '$lib/components/nav-user.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { BriefcaseIcon } from 'lucide-svelte';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		collapsible = 'icon',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root bind:ref {collapsible} {...restProps}>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
