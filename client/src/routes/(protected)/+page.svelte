<script lang="ts">
	import Counter from '@/counter.svelte';
	import { LocalUser } from '@/local-user';

	const user = LocalUser.getCtx();
</script>

<pre>
    {JSON.stringify($user, null, 2)}
</pre>
<Counter count={0}></Counter>
