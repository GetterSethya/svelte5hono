<script lang="ts">
	import { appFetch } from '@/appFetch';
	import { Client } from '@/client';
	import { JWT } from '@/jwt';
	import { applicationValidator } from '@root/lib/validator/application-validator';
	import { createMutation, createQuery } from '@tanstack/svelte-query';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import * as Form from '@/components/ui/form/';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '@/components/ui/input';
	import { ICON_SIZE } from '@/constant';
	import { SaveIcon } from 'lucide-svelte';
	import Textarea from '@/components/ui/textarea/textarea.svelte';
	import { writable } from 'svelte/store';
	import type { DropdownItem } from '@/components/ui/async-combobox/async-combobox.svelte';
	import AsyncCombobox from '@/components/ui/async-combobox/async-combobox.svelte';
	import * as Select from '@/components/ui/select/';
	import { APPLICATION_STATUS, APPLICATION_STATUS_KEY } from '@root/lib/constant';
	import ApplicationStatus from '@/components/ui/badge/application-status.svelte';
	import { z } from 'zod';
	import { ResponseError } from '@/utils';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	type UpsertFormProps = {
		data: SuperValidated<Infer<typeof applicationValidator>>;
		id?: string;
	};

	const client = Client.getCtx();
	const companies = writable<DropdownItem[]>([]);
	let selectedCompany = $state('');
	let { id, data }: UpsertFormProps = $props();

	const upsertQuery = createQuery({
		queryKey: ['upsert-application', id],
		queryFn: async () => {
			const response = await client.application.id[':id'].$get(
				{
					param: { id: id! }
				},
				{
					init: { headers: { Authorization: JWT.access! } },
					fetch: appFetch
				}
			);

			return response.json();
		},
		enabled: !!id
	});

	const companyQuery = createQuery({
		queryKey: ['company-dropdown'],
		queryFn: async () => {
			const response = await client.company.index.$get(
				{
					query: { page: '1', limit: '5', sort: 'updated_at' }
				},
				{
					init: { headers: { Authorization: JWT.access! } },
					fetch: appFetch
				}
			);

			const resData = await response.json();
			return resData.result?.items.map((company) => ({
				label: company.name,
				value: company.id.toString()
			}));
		}
	});

	const companyLoadFn = async (search: string) => {
		const response = await client.company.index.$get(
			{
				query: { q: search, page: '1', limit: '5', sort: 'updated_at' }
			},
			{
				init: { headers: { Authorization: JWT.access! } },
				fetch: appFetch
			}
		);

		const resData = await response.json();
		if (!resData || !resData.result) {
			return [];
		}

		return resData.result.items.map((company) => ({
			label: company.name,
			value: company.id.toString()
		}));
	};

	const upsertMutation = createMutation({
		mutationFn: async (data: z.infer<typeof applicationValidator>) => {
			if (id) {
				const response = await client.application.id[':id'].$patch(
					{
						param: { id: id },
						form: { ...data, company: data.company.toString() }
					},
					{
						init: { headers: { Authorization: JWT.access! } },
						fetch: appFetch
					}
				);

				const resData = await response.json();
				if (response.status !== 200 || !resData.result) {
					throw new ResponseError(
						response.status,
						null,
						resData.message || 'Update application failed'
					);
				}

				return resData.result;
			}

			const response = await client.application.index.$post(
				{
					form: { ...data, company: data.company.toString() }
				},
				{
					init: { headers: { Authorization: JWT.access! } },
					fetch: appFetch
				}
			);

			const resData = await response.json();
			if (response.status !== 201 || !resData.result) {
				throw new ResponseError(
					response.status,
					null,
					resData.message || 'Create application failed'
				);
			}

			return resData.result;
		},
		onSuccess: () => {
			toast.success(id ? 'Update application succcess' : 'Create application success');
			goto('/');
		},
		onError: (error) => {
			if (error instanceof ResponseError) {
				toast.error(error.message);
				return;
			}
			toast.error('Something went wrong');
		}
	});

	const form = superForm(data, {
		validationMethod: 'auto',
		validators: zodClient(applicationValidator),
		SPA: true,
		onUpdate: async ({ form: fd }) => {
			if (fd.valid) {
				$upsertMutation.mutate(fd.data);
			}
		}
	});

	$effect(() => {
		if ($companyQuery.data) {
			$companies = $companyQuery.data;
		}
	});

	const { form: formData, enhance, reset } = form;

	$effect(() => {
		const userCompany = $upsertQuery.data?.result?.companies;
		if ($companyQuery.data && userCompany) {
			const companyIndex = $companies.findIndex((c) => c.value === userCompany.id.toString());

			if (companyIndex === -1) {
				$companies.push({
					value: userCompany.id.toString(),
					label: userCompany.name
				});
			}
		}
	});

	$effect(() => {
		if ($upsertQuery.isSuccess && $upsertQuery.data.result) {
			const res = $upsertQuery.data.result;
			const application = res.applications;
			reset({
				data: {
					...application,
					notes: application.notes || undefined,
					position: application.position || undefined,
					company: application.company || undefined
				}
			});

			selectedCompany = application.company?.toString()!;
		}
	});

	function handleOnselect(originalData: DropdownItem) {
		$formData.company = Number(originalData.value);
	}
</script>

<form method="POST" use:enhance class="flex flex-col">
	<Form.Field {form} name="company">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Company</Form.Label>
				<AsyncCombobox
					{...props}
					bind:value={selectedCompany}
					loadFn={companyLoadFn}
					items={companies}
					onSelect={handleOnselect}
					placeholder="Input company"
				/>
			{/snippet}
		</Form.Control>
		<Form.Description />
		<Form.FieldErrors class="font-normal" />
	</Form.Field>

	<Form.Field {form} name="position">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Position</Form.Label>
				<Input placeholder="Position" {...props} bind:value={$formData.position} />
			{/snippet}
		</Form.Control>
		<Form.Description />
		<Form.FieldErrors class="font-normal" />
	</Form.Field>
	<Form.Field {form} name="status">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Status</Form.Label>
				<Select.Root type="single" bind:value={$formData.status} name={props.name}>
					<Select.Trigger {...props}>
						{$formData.status ? APPLICATION_STATUS[$formData.status] : 'Select application status'}
					</Select.Trigger>
					<Select.Content>
						{#each APPLICATION_STATUS_KEY as status}
							<Select.Item value={status} label={APPLICATION_STATUS[status]}>
								{#snippet children()}
									<ApplicationStatus {status} />
								{/snippet}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Form.Control>
		<Form.Description />
		<Form.FieldErrors class="font-normal" />
	</Form.Field>
	<Form.Field {form} name="notes">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Notes</Form.Label>
				<Textarea placeholder="Notes" {...props} bind:value={$formData.notes} />
			{/snippet}
		</Form.Control>
		<Form.Description />
		<Form.FieldErrors class="font-normal" />
	</Form.Field>
	<Form.Button class="my-2.5 ms-auto" disabled={$upsertMutation.isPending}>
		<span class="flex flex-row items-center gap-2.5">
			<span>Save</span>
			<SaveIcon size={ICON_SIZE} />
		</span>
	</Form.Button>
</form>
