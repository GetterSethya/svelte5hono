<script lang="ts">
	import { page } from '$app/state';
	import { LIMIT } from '@/constant';
	import * as Select from '../select/';
	import { goto } from '$app/navigation';

	type LimitProps = { value?: number[]; totalItems: number };

	let { value, totalItems }: LimitProps = $props();

	let limit = $state(Number(page.url.searchParams.get('limit') ?? '10'));
	let pageNumber = $state(Number(page.url.searchParams.get('page') ?? '1'));

	const recalculatePage = (
		currentPage: number,
		totalRow: number,
		deletedDataLength: number,
		limit: number
	) => {
		let page = currentPage;
		let totalItem = totalRow - deletedDataLength;
		const totalPage = Math.ceil(totalItem / limit);
		const diffPage = totalPage - page;
		if (diffPage < 0) {
			page = page - Math.abs(diffPage);
		}

		return page;
	};

	function handleValueChange(value: string) {
		limit = Number(value);
		const recal = recalculatePage(pageNumber, totalItems, 0, limit);
		page.url.searchParams.set('limit', limit.toString());
		page.url.searchParams.set('page', recal.toString());

		goto(`${page.url.pathname}?${page.url.searchParams.toString()}`, {
			keepFocus: true,
			noScroll: true
		});
	}
</script>

<Select.Root type="single" onValueChange={handleValueChange} value={limit.toString()}>
	<Select.Trigger class="w-[180px] text-sm font-medium">
		Limit: {limit}
	</Select.Trigger>
	<Select.Content>
		{#if value}
			{#each value as l}
				<Select.Item value={l.toString()}>{l}</Select.Item>
			{/each}
		{:else}
			{#each LIMIT as l}
				<Select.Item value={l.toString()}>{l}</Select.Item>
			{/each}
		{/if}
	</Select.Content>
</Select.Root>
