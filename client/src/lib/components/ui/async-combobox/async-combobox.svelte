<script lang="ts" module>
	export type DropdownItem = { label: string; value: string };
</script>

<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import * as Popover from '@/components/ui/popover/';
	import * as Command from '@/components/ui/command/';
	import type { Writable } from 'svelte/store';
	import { Input } from '../input';
	import { CheckIcon, ChevronDown } from 'lucide-svelte';
	import { cn } from '@/utils';
	import { useDebounce } from 'runed';
	import { LoaderIcon } from 'lucide-svelte/icons';
	import { ICON_SIZE } from '@/constant';

	type AsyncComboboxProps = {
		items: Writable<DropdownItem[]>;
		loadFn: (search: string) => Promise<DropdownItem[]>;
		onSelect?: (originalData: DropdownItem) => void;
		class?: string;
		placeholder?: string;
		open?: boolean;
	} & HTMLInputAttributes;

	let {
		//
		open = $bindable(),
		items,
		loadFn,
		onSelect,
		class: className,
		placeholder,
		value = $bindable(''),
		name,
		disabled,
		...rest
	}: AsyncComboboxProps = $props();

	let selectedLabel = $state(placeholder);
	let isLoading = $state(false);

	$effect(() => {
		if ($items.length > 0) {
			const find = $items.find((f) => f.value === value)?.label;
			if (find) {
				selectedLabel = find;
			} else {
				selectedLabel = placeholder;
				value = '';
			}
		}
	});

	async function handleInputChange(
		e: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) {
		try {
			isLoading = true;
			const inputEl = e.target as HTMLInputElement;
			const response = await loadFn(inputEl.value);

			if (response.length > 0) {
				$items = response;
			}
		} catch (error) {
			console.error(error);
		} finally {
			isLoading = false;
		}
	}
</script>

<input type="hidden" {name} bind:value {...rest} />
<Popover.Root>
	<Popover.Trigger
		class="flex w-full flex-row items-center justify-between rounded-lg border border-input"
		role="combobox"
	>
		<Input
			class={cn(
				'w-full border-none bg-transparent p-2.5',
				disabled ? 'cursor-not-allowed' : 'cursor-pointer'
			)}
			placeholder={selectedLabel || 'Select Item'}
			readonly={true}
			{disabled}
			role="combobox"
			aria-expanded={open}
			value={selectedLabel !== placeholder ? selectedLabel : ''}
		/>
		<ChevronDown class="opacity-50" />
	</Popover.Trigger>
	<Popover.Content class="w-full p-0" align="start">
		<Command.Root shouldFilter={false}>
			<Command.Input
				oninput={useDebounce((e) => handleInputChange(e), 500)}
				autofocus
				class="h-9"
				placeholder="Search..."
			/>
			{#if isLoading}
				<div class="flex min-h-[12rem] items-center justify-center gap-1">
					<LoaderIcon class="animate-spin" size={ICON_SIZE} />
					<span class="text-center text-sm">Loading...</span>
				</div>
			{:else if $items.length === 0}
				<div class="flex min-h-[12rem] items-center justify-center gap-1">
					<span class="text-center text-sm">No results found.</span>
				</div>
			{:else}
				<Command.List class="p-1">
					{#each $items as item}
						<Command.Item
							onclick={() => {
								value = item.value;
								selectedLabel = item.label;
								onSelect?.(item);
							}}
							value={item.value}
						>
							<CheckIcon class={cn(value !== item.value && 'text-transparent')} />
							{item.label}</Command.Item
						>
					{/each}
				</Command.List>
			{/if}
		</Command.Root>
	</Popover.Content>
</Popover.Root>
