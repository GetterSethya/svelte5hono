<script lang="ts">
	import { goto } from '$app/navigation';
	import { navigating, page as pageState } from '$app/state';
	import * as Pagination from '@/components/ui/pagination/';

	type PaginationProps = {
		totalItems: number;
		page?: number;
	};

	let {
		totalItems,
		page = $bindable(Number(pageState.url.searchParams.get('page') ?? '1'))
	}: PaginationProps = $props();

	let perPage = $state(Number(pageState.url.searchParams.get('limit') ?? '10'));

	function handleChange(pageNumber: number) {
		pageState.url.searchParams.set('page', pageNumber.toString());
		goto(`${pageState.url.pathname}?${pageState.url.searchParams.toString()}`, {
			keepFocus: true,
			noScroll: true
		});
	}

	$effect(() => {
		if (navigating) {
			perPage = Number(pageState.url.searchParams.get('limit') ?? '10');
			page = Number(pageState.url.searchParams.get('page') ?? '1');
		}
	});
</script>

<Pagination.Root
	onPageChange={handleChange}
	count={totalItems}
	{perPage}
	bind:page
	class="mx-0 w-fit"
>
	{#snippet children({ pages, currentPage })}
		<Pagination.Content>
			<Pagination.Item>
				<Pagination.PrevButton />
			</Pagination.Item>
			{#each pages as page (page.key)}
				{#if page.type === 'ellipsis'}
					<Pagination.Item>
						<Pagination.Ellipsis />
					</Pagination.Item>
				{:else}
					<Pagination.Item>
						<Pagination.Link {page} isActive={currentPage === page.value}>
							{page.value}
						</Pagination.Link>
					</Pagination.Item>
				{/if}
			{/each}
			<Pagination.Item>
				<Pagination.NextButton />
			</Pagination.Item>
		</Pagination.Content>
	{/snippet}
</Pagination.Root>
