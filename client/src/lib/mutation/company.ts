import { appFetch } from '@/appFetch';
import type { Client } from '@/client';
import { JWT } from '@/jwt';
import { ResponseError } from '@/utils';
import type { companyValidator } from '@root/lib/validator/company-validator';
import { createMutation } from '@tanstack/svelte-query';
import { toast } from 'svelte-sonner';
import type { z } from 'zod';

export const upsertMutation = (client: ReturnType<typeof Client.getCtx>, id?: string) =>
	createMutation({
		mutationFn: async (data: z.infer<typeof companyValidator>) => {
			if (id) {
				const response = await client.company.id[':id'].$patch({
					param: { id },
					form: { name: data.name, address: data.address || undefined }
				});

				const resData = await response.json();
				if (response.status !== 200 || !resData.result) {
					throw new ResponseError(
						response.status,
						null,
						resData.message || 'Update company failed'
					);
				}

				return resData.result;
			}
			const response = await client.company.index.$post(
				{
					form: { name: data.name, address: data.address || undefined }
				},
				{
					fetch: appFetch,
					init: { headers: { Authorization: JWT.access || '' } }
				}
			);
			const resData = await response.json();
			if (response.status !== 201 || !resData.result) {
				throw new ResponseError(response.status, null, resData.message || 'Create company failed');
			}

			return resData.result;
		},
		onError: (error) => {
			if (error instanceof ResponseError) {
				toast.error(error.message);
				return;
			}

			toast.error('Something went wrong');
		}
	});
