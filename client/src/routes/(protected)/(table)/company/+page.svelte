<script lang="ts">
	import { goto } from '$app/navigation';
	import { appFetch } from '@/appFetch';
	import { Client } from '@/client';
	import { Button } from '@/components/ui/button';
	import DataTable, { type TableActions } from '@/components/ui/data-table/data-table.svelte';
	import { JWT } from '@/jwt';
	import type { CompanyEntity } from '@root/lib/repository/company-repository';
	import { createQuery } from '@tanstack/svelte-query';
	import type { ColumnDef } from '@tanstack/table-core';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import { renderComponent } from '@/components/ui/data-table';
	import Checkbox from '@/components/ui/checkbox/checkbox.svelte';

	const client = Client.getCtx();

	const companyQuery = createQuery({
		queryKey: ['company-table'],
		queryFn: async () => {
			const response = await client.company.index.$get(
				{
					query: {}
				},
				{
					fetch: appFetch,
					init: { headers: { Authorization: JWT.access || '' } }
				}
			);

			return response.json();
		}
	});

	const idDateFormat = Intl.DateTimeFormat('id-ID');

	const columns: ColumnDef<CompanyEntity>[] = [
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
			accessorKey: 'name',
			header: 'Company Name',
			enableHiding: false
		},
		{
			accessorKey: 'updated_at',
			header: 'Updated',
			cell: ({ row }) => idDateFormat.format(row.original.updated_at),
			size: 1,
			enableHiding: true
		},
		{
			accessorKey: 'created_at',
			header: 'Created',
			cell: ({ row }) => idDateFormat.format(row.original.created_at),
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

	const actions: TableActions<CompanyEntity> = {
		content: Actions
	};
</script>

{#snippet Actions(data: CompanyEntity)}
	<DropdownMenu.Content side="left" align="start">
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>Actions</DropdownMenu.GroupHeading>
			<DropdownMenu.Item onclick={() => goto(`/company/upsert?id=${data.id}`)}
				>Edit</DropdownMenu.Item
			>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
{/snippet}

<Button onclick={() => goto('/company/upsert')}>Add Company</Button>
{#if $companyQuery.data}
	{@const companies = $companyQuery.data.result?.items}
	{#if companies}
		<DataTable data={companies} {actions} {columns} />
	{/if}
{/if}
