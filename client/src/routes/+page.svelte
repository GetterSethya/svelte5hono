<script lang="ts">
	import Counter from '$lib/counter.svelte';
	import Button from '@/components/ui/button/button.svelte';

	let count = $state(0);

</script>

<span>Hello mom 💖</span>

<Counter bind:count />
<span class="text-red-500">count yang diluar {count}</span>
<Button
	onclick={() => {
		count++;
	}}>Hit me {count}</Button
>


