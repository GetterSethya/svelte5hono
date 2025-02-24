<script lang="ts" module>
	export type TableActions<TData> = {
		content: Snippet<[TData]>;
	};

	export type BulkbarArgs<TData> = {
		data: Row<TData>[];
		table: TTable<TData>;
		isMutating: (value: boolean) => void;
	};

	export type TableBulkbar<TData> = {
		onAction: (args: BulkbarArgs<TData>) => void;
	};
</script>

<script lang="ts" generics="TData,TValue">
	import {
		getCoreRowModel,
		type ColumnDef,
		type Row,
		type RowSelectionState,
		type VisibilityState,
		type Table as TTable
	} from '@tanstack/table-core';
	import { createSvelteTable } from '.';
	import * as Table from '@/components/ui/table/';
	import * as DropdownMenu from '@/components/ui/dropdown-menu/';
	import FlexRender from './flex-render.svelte';
	import type { Snippet } from 'svelte';
	import { Button } from '../button';
	import { Ellipsis, RefreshCwIcon } from 'lucide-svelte';
	import { ICON_SIZE } from '@/constant';
	import { cn, flyAndScale } from '@/utils';

	type DataTableProps<TData, TValue> = {
		columns: ColumnDef<TData, TValue>[];
		data: TData[];
		actions: TableActions<TData>;
		bulkbar?: TableBulkbar<TData>;
	};

	let { data, columns, actions, bulkbar }: DataTableProps<TData, TValue> = $props();

	let columnVisibility = $state<VisibilityState>({});
	let rowSelection = $state<RowSelectionState>({});
	let isMutating = $state(false);

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		getCoreRowModel: getCoreRowModel(),
		defaultColumn: {
			minSize: 1
		},
		onColumnVisibilityChange: (updater) => {
			if (typeof updater === 'function') {
				columnVisibility = updater(columnVisibility);
			} else {
				columnVisibility = updater;
			}
		},
		onRowSelectionChange: (updater) => {
			if (typeof updater === 'function') {
				rowSelection = updater(rowSelection);
			} else {
				rowSelection = updater;
			}
		},
		state: {
			get columnVisibility() {
				return columnVisibility;
			},
			get rowSelection() {
				return rowSelection;
			}
		}
	});
</script>

<div class="max-w-[93vw] overflow-x-auto rounded-md border">
	<Table.Root>
		<Table.Header>
			{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
				<Table.Row>
					{#each headerGroup.headers as header (header.id)}
						<Table.Head class={cn(header.column.getSize() === 1 ? 'w-1 text-nowrap' : '')}>
							{#if header.id === 'actions'}
								<DropdownMenu.Root>
									<DropdownMenu.Trigger>
										{#snippet child({ props })}
											<Button {...props} variant="ghost" size="icon" class="relative size-8 p-0">
												<Ellipsis size={ICON_SIZE} />
											</Button>
										{/snippet}
									</DropdownMenu.Trigger>
									<DropdownMenu.Content align="end" class="z-20 flex flex-col">
										{#each table.getAllColumns().filter((col) => col.getCanHide()) as column}
											<DropdownMenu.CheckboxItem
												class="capitalized"
												checked={column.getIsVisible()}
												onCheckedChange={(value) => column.toggleVisibility(!!value)}
											>
												{#if typeof column.columnDef.header === 'string'}
													{column.columnDef.header}
												{/if}
												{#if typeof column.columnDef.header === 'function'}
													{column.columnDef.header(header.getContext())}
												{/if}
											</DropdownMenu.CheckboxItem>
										{/each}
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							{:else}
								<FlexRender
									content={header.column.columnDef.header}
									context={header.getContext()}
								/>
							{/if}
						</Table.Head>
					{/each}
				</Table.Row>
			{/each}
		</Table.Header>
		<Table.Body>
			{#each table.getRowModel().rows as row (row.id)}
				<Table.Row data-state={row.getIsSelected() && 'selected'}>
					{#each row.getVisibleCells() as cell (cell.id)}
						{#if cell.column.id === 'actions'}
							<Table.Cell class="w-1">
								<DropdownMenu.Root>
									<DropdownMenu.Trigger>
										{#snippet child({ props })}
											<Button {...props} variant="ghost" size="icon" class="relative size-8 p-0">
												<span class="sr-only">Open menu</span>
												<Ellipsis size={ICON_SIZE} />
											</Button>
										{/snippet}
									</DropdownMenu.Trigger>
									{@render actions.content(cell.row.original)}
								</DropdownMenu.Root>
							</Table.Cell>
						{:else}
							<Table.Cell class={cell.column.getSize() === 1 ? 'w-1' : ''}>
								<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
							</Table.Cell>
						{/if}
					{/each}
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
{#if bulkbar && table.getFilteredSelectedRowModel().rows.length > 0}
	<div
		transition:flyAndScale
		class="fixed bottom-[10%] flex flex-1 flex-row items-center justify-center self-center text-sm"
	>
		<div
			class="flex w-[50vw] flex-row rounded-lg border border-foreground/20 bg-muted p-2.5
text-muted-foreground shadow-sm max-sm:w-[80vw] lg:w-[40vw]"
		>
			<div class="flex w-1/2 flex-row items-center gap-1">
				<span class="text-nowrap">
					{table.getFilteredSelectedRowModel().rows.length} of
					{table.getFilteredRowModel().rows.length}
					row(s) selected
				</span>
				<Button
					disabled={isMutating}
					onclick={() => table.resetRowSelection(true)}
					size="sm"
					variant="outline"
				>
					<RefreshCwIcon size={ICON_SIZE} />
					Reset
				</Button>
			</div>
			<div class="ms-auto flex w-fit lg:w-1/2">
				<Button
					onclick={() => {
						const rows = table.getFilteredSelectedRowModel().rows;
						bulkbar.onAction({
							data: rows,
							table,
							isMutating: (value) => {
								isMutating = value;
							}
						});
					}}
					disabled={isMutating}
					size="sm"
					variant="destructive"
					class="ms-auto"
				>
					Delete
				</Button>
			</div>
		</div>
	</div>
{/if}
