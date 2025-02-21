<script lang="ts">
	let { children } = $props();
</script>

<div class="gap-4- flex flex-1 flex-col p-4 pt-0">
	{@render children()}
</div>
