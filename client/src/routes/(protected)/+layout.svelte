<script lang="ts">
	import { LocalUser } from '@/local-user';

	let { children ,data} = $props();

    LocalUser.setCtx(data.user)
</script>

{@render children()}
