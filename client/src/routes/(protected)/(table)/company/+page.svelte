<script lang="ts">
	import { goto } from '$app/navigation';
	import { appFetch } from '@/appFetch';
	import { Client } from '@/client';
	import { Button } from '@/components/ui/button';
	import { JWT } from '@/jwt';
	import { createQuery } from '@tanstack/svelte-query';

	const client = Client.getCtx();

	const companyQuery = createQuery({
		queryKey: ['company-table'],
		queryFn: async () => {
			const response = await client.company.index.$get(
				{
					query: {}
				},
				{
					fetch: appFetch,
					init: { headers: { Authorization: JWT.access || '' } }
				}
			);

			return response.json();
		}
	});
</script>

<Button onclick={() => goto('/company/upsert')}>Add Company</Button>
{#if $companyQuery.data}
	{@const companies = $companyQuery.data.result?.items}
	{#if companies}
		{#each companies as company}
			<div>
				<p>{company.name}</p>
				<p>{company.address}</p>
				<Button onclick={()=>{goto(`/company/upsert?id=${company.id}`)}}>update</Button>
			</div>
		{/each}
	{/if}
{/if}
