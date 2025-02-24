<script lang="ts">
	import * as Tooltip from '@/components/ui/tooltip/';
	import { idDateFormat, idDateTimeFormat, idTimeFormat } from '@/utils';
	type CompactDateProps = {
		dateString: number;
	};

	let { dateString }: CompactDateProps = $props();
	const dateObj = $derived(new Date(dateString));
</script>

<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<div class="flex flex-col">
				<span class="text-sm">{idDateFormat.format(dateObj)}</span>
				<span class="text-sm text-foreground/50"
					>{idTimeFormat.format(dateObj).replaceAll('.', ':')}</span
				>
			</div>
		</Tooltip.Trigger>
		<Tooltip.Content>
			<span class="text-foreground/50">{idDateTimeFormat.format(dateObj)}</span>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
