import { appFetch } from '@/appFetch';
import type { Client } from '@/client';
import { JWT } from '@/jwt';
import { createQuery } from '@tanstack/svelte-query';

export const key = 'company-upsert';
export const upsertQuery = (client: ReturnType<typeof Client.getCtx>, id?: string) =>
	createQuery({
		queryKey: [key,id],
		queryFn: async () => {
			const response = await client.company.id[':id'].$get(
				{
					param: { id: id! }
				},
				{
					fetch: appFetch,
					init: { headers: { Authorization: JWT.access! } }
				}
			);

			return response.json();
		},
		enabled: !!id
	});
