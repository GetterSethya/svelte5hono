<script lang="ts">
	import { Button } from '@/components/ui/button';
	import UpsertForm from './upsert-form.svelte';
	import { goto } from '$app/navigation';
	import { ChevronLeft } from 'lucide-svelte';
	import { ICON_SIZE } from '@/constant';
	import { page } from '$app/state';

	let { data } = $props();
</script>

<div class="flex min-h-[100vh] flex-1 flex-col gap-2.5 rounded-xl md:min-h-min">
	<div class="flex flex-row justify-between">
		<Button onclick={() => goto('/')} variant="outline" size="sm" class="w-fit">
			<ChevronLeft size={ICON_SIZE} />
			<span class="text-sm">Back</span>
		</Button>
	</div>
	<UpsertForm id={page.url.searchParams.get('id') || undefined} data={data.form} />
</div>
