<script lang="ts">
	import { Button } from './components/ui/button';
	import { LocalUser } from './local-user';

	type CounterProps = {
		count: number;
	};

	let { count = $bindable() }: CounterProps = $props();
	const user = LocalUser.getCtx();

	function handleCount() {
        if ($user) {
            $user.name+="💡"
        }
	}
</script>

<Button onclick={handleCount}>Count: {count}</Button>
{#if $user}
	<span>nama:{$user.name}</span>
{/if}
