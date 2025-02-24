<script lang="ts">
	import { page } from '$app/state';
	import { SearchIcon, XIcon } from 'lucide-svelte';
	import { Button } from '../button';
	import { ICON_SIZE } from '@/constant';
	import { Input } from '../input';
	import { goto } from '$app/navigation';
	import { useDebounce } from 'runed';

	let search = $state(page.url.searchParams.get('q') || '');

	function handleValueChange(value: string) {
		if (value === '') return handleClear();
		search = value;
		page.url.searchParams.set('q', search);
		goto(`${page.url.pathname}?${page.url.searchParams.toString()}`, {
			keepFocus: true,
			noScroll: true
		});
	}

	function handleClear() {
		search = '';
		page.url.searchParams.delete('q');
		goto(`${page.url.pathname}?${page.url.searchParams.toString()}`, {
			keepFocus: true,
			noScroll: true
		});
	}
</script>

<div class="flex flex-row rounded-lg border border-border">
	<Input
		class="h-auto border-none py-0 focus-visible:ring-0 focus-visible:ring-offset-0"
		placeholder="Search..."
		bind:value={search}
		oninput={useDebounce(() => handleValueChange(search), 500)}
	/>
	{#if search !== ''}
		<Button onclick={handleClear} size="icon" variant="ghost" class="hover:bg-transparent">
			<XIcon size={ICON_SIZE}></XIcon>
		</Button>
	{:else}
		<Button size="icon" variant="ghost" class="hover:bg-transparent">
			<SearchIcon size={ICON_SIZE} />
		</Button>
	{/if}
</div>
