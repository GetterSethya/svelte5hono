<script lang="ts">
	import { Client } from '@/client';
	import '../app.css';
	import { browser } from '$app/environment';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { Toaster } from '@/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});

	Client.setCtx();

	let { children } = $props();
</script>

<QueryClientProvider client={queryClient}>
	<ModeWatcher />
	<Toaster richColors />
	{@render children()}
</QueryClientProvider>
