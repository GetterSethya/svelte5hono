<script lang="ts">
	import { APPLICATION_STATUS, type APPLICATION_STATUS_KEY } from '@root/lib/constant';
	import { Badge } from '.';
	type ApplicationStatusBadgeProps = {
		status: (typeof APPLICATION_STATUS_KEY)[number];
	};
	let { status }: ApplicationStatusBadgeProps = $props();
</script>

{#if status === 'sent'}
	<Badge
		class="border border-blue-500 bg-blue-100 text-blue-500 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100"
	>
		{APPLICATION_STATUS[status]}</Badge
	>
{:else if status === 'reply'}
	<Badge
		class="border border-emerald-500 bg-emerald-100 text-emerald-500 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-100"
		>{APPLICATION_STATUS[status]}</Badge
	>
{:else if status === 'ghosting'}
	<Badge class="border border-border bg-muted/20 text-foreground hover:bg-muted/20 dark:bg-card"
		>{APPLICATION_STATUS[status]}</Badge
	>
{:else if status === 'offering'}
	<Badge
		class="border border-violet-500 bg-violet-100 text-violet-500 hover:bg-violet-200 dark:bg-violet-900 
dark:text-violet-100">{APPLICATION_STATUS[status]}</Badge
	>
{:else}
	<Badge
		class="border border-orange-500 bg-orange-100 text-orange-500 hover:bg-orange-200 dark:bg-orange-900 
dark:text-orange-100">{APPLICATION_STATUS[status]}</Badge
	>
{/if}
