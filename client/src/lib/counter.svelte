<script lang="ts">
	type CounterProps = {
		count: number;
	};

	let { count = $bindable() }: CounterProps = $props();

	function handleCount() {
		count++;
	}
</script>

<button onclick={handleCount}>Count: {count}</button>
