<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { Button } from '../button';
	import { cn } from '@/utils';
	import { ArrowUpDownIcon } from 'lucide-svelte';
	import { ICON_SIZE } from '@/constant';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	type TableSortProps = ComponentProps<typeof Button> & {
		value: string;
		key: string;
	};

	let { variant = 'ghost', class: className, value, key, ...rest }: TableSortProps = $props();

	function handleClick() {
		const searchParams = new URLSearchParams(page.url.searchParams);
		const currentOrder = searchParams.get('order') ?? 'DESC';
		page.url.searchParams.set('sort', key);
		page.url.searchParams.set('order', currentOrder === 'ASC' ? 'DESC' : 'ASC');

		goto(`${page.url.pathname}?${page.url.searchParams.toString()}`, {
			keepFocus: true,
			noScroll: true
		});
	}
</script>

<Button
    onclick={handleClick}
    {variant} class={cn(['w-fit justify-start p-0 hover:bg-transparent', className])} {...rest}>
	{value}
	<ArrowUpDownIcon size={ICON_SIZE} />
</Button>
