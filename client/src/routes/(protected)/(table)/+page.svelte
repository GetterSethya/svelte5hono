<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { appFetch } from '@/appFetch';
	import { Client } from '@/client';
	import { Button } from '@/components/ui/button';
	import DataTable, {
		type TableActions,
		type TableBulkbar
	} from '@/components/ui/data-table/data-table.svelte';
	import { JWT } from '@/jwt';
	import { createMutation, createQuery } from '@tanstack/svelte-query';
	import type { ColumnDef, Row } from '@tanstack/table-core';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import { renderComponent, renderSnippet } from '@/components/ui/data-table';
	import Checkbox from '@/components/ui/checkbox/checkbox.svelte';
	import Search from '@/components/ui/queryable/search.svelte';
	import { PlusIcon } from 'lucide-svelte';
	import { ICON_SIZE } from '@/constant';
	import Limit from '@/components/ui/queryable/limit.svelte';
	import Pagination from '@/components/ui/queryable/pagination.svelte';
	import { SearchParams } from '@/hooks/search-params';
	import Sort from '@/components/ui/queryable/sort.svelte';
	import DateCompact from '@/components/ui/cell/date-compact.svelte';
	import { toast } from 'svelte-sonner';
	import type { InferResponseType } from 'hono';
	import ApplicationStatus from '@/components/ui/badge/application-status.svelte';

	const client = Client.getCtx();
	const listApp = client.application.index.$get;
	type ApplicationList = InferResponseType<typeof listApp>;
	type ApplicationItem = ApplicationList['result']['items'][number];
	const searchParams = new SearchParams();

	const applicationQuery = createQuery({
		queryKey: [
			'application-table',
			searchParams.page,
			searchParams.limit,
			searchParams.sort,
			searchParams.order,
			searchParams.search
		],
		queryFn: async () => {
			const response = await client.application.index.$get(
				{
					query: {
						page: searchParams.page.toString(),
						limit: searchParams.limit.toString(),
						sort: searchParams.sort,
						order: searchParams.order,
						q: searchParams.search
					}
				},
				{
					fetch: appFetch,
					init: { headers: { Authorization: JWT.access || '' } }
				}
			);

			return response.json();
		},
		staleTime: 0
	});

	const columns: ColumnDef<ApplicationItem>[] = [
		{
			id: 'select',
			header: ({ table }) =>
				renderComponent(Checkbox, {
					checked: table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected(),
					indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
					onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
					'aria-label': 'Select all'
				}),
			cell: ({ row }) =>
				renderComponent(Checkbox, {
					checked: row.getIsSelected(),
					onCheckedChange: (value) => row.toggleSelected(!!value),
					'aria-label': 'Select all'
				}),
			enableHiding: false,
			size: 1
		},
		{
			id: 'Company',
			accessorKey: 'applications.company',
			header: 'Company',
			cell: ({ row }) => row.original.companies?.name,
			enableHiding: false
		},
		{
			id: 'Position',
			accessorKey: 'applications.position',
			header: 'Position',
			cell: ({ row }) => row.original.applications.position,
			enableHiding: true
		},
		{
			id: 'Status',
			accessorKey: 'applications.status',
			header: 'Status',
			cell: ({ row }) =>
				renderComponent(ApplicationStatus, { status: row.original.applications.status }),
			enableHiding: true
		},
		{
			id: 'Updated',
			accessorKey: 'updated_at',
			header: () =>
				renderComponent(Sort, {
					key: 'updated_at',
					value: 'Updated'
				}),
			cell: ({ row }) =>
				renderComponent(DateCompact, { dateString: row.original.applications.updated_at }),
			size: 1,
			enableHiding: true
		},
		{
			id: 'Created',
			accessorKey: 'created_at',
			header: () =>
				renderComponent(Sort, {
					key: 'created_at',
					value: 'Created'
				}),
			cell: ({ row }) =>
				renderComponent(DateCompact, { dateString: row.original.applications.created_at }),
			size: 1,
			enableHiding: true
		},
		{
			id: 'actions',
			header: 'Actions',
			size: 1,
			enableHiding: false
		}
	];

	const bulkbarMutation = createMutation({
		mutationFn: async (data: Row<ApplicationItem>[]) => {
			for (const application of data.map((d) => d.original)) {
				await client.application.id[':id'].$delete(
					{
						param: { id: application.applications.id.toString() }
					},
					{
						init: { headers: { Authorization: JWT.access! } },
						fetch: appFetch
					}
				);
			}
		},
		onError: (error) => {
			console.error(error);
			toast.error('Error when deleting data');
		}
	});

	const actions: TableActions<ApplicationItem> = {
		content: Actions
	};

	const bulkbar: TableBulkbar<ApplicationItem> = {
		onAction: (args) => {
			args.isMutating(true);
			$bulkbarMutation.mutate(args.data, {
				onSuccess: () => {
					$applicationQuery.refetch();
					toast.success('Application deleted successfully');
				},
				onSettled: () => {
					args.isMutating(false);
					args.table.resetRowSelection();
				}
			});
		}
	};

	afterNavigate(() => $applicationQuery.refetch());
</script>

{#snippet Actions(data: ApplicationItem)}
	<DropdownMenu.Content side="left" align="start">
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>Actions</DropdownMenu.GroupHeading>
			<DropdownMenu.Item onclick={() => goto(`/application/upsert?id=${data.applications.id}`)}
				>Edit</DropdownMenu.Item
			>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
{/snippet}

<div class="flex flex-col gap-2.5">
	<div class="flex w-full flex-row items-center justify-end gap-2.5">
		<Search></Search>
		<Button onclick={() => goto('/application/upsert')}>
			<PlusIcon size={ICON_SIZE} />
		</Button>
	</div>

	{#if $applicationQuery.data}
		{@const companies = $applicationQuery.data.result?.items}
		{#if companies}
			<DataTable {bulkbar} data={companies} {actions} {columns} />
		{/if}
		<div class="flex flex-row justify-between">
			<Limit totalItems={$applicationQuery.data.result.meta.totalItems} />
			<Pagination totalItems={$applicationQuery.data.result.meta.totalItems} />
		</div>
	{/if}
</div>
