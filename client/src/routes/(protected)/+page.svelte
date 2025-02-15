<script lang="ts">
	import { goto } from '$app/navigation';
	import { Client } from '@/client';
	import { Button } from '@/components/ui/button';
	import Counter from '@/counter.svelte';
	import { LocalUser } from '@/local-user';
	import { logoutMutation } from '@/mutation/logout';
	import { toast } from 'svelte-sonner';

	const user = LocalUser.getCtx();
	const client = Client.getCtx();
	const mutation = logoutMutation(client);
</script>

<pre>
    {JSON.stringify($user, null, 2)}
</pre>
<Counter count={0}></Counter>
<Button
	variant="destructive"
	onclick={() => {
		$mutation.mutate(undefined, {
			onSuccess: () => {
				toast.success('Logout');
                goto("/login")
			}
		});
	}}
	disabled={$mutation.isPending}
>
	Logout
</Button>
