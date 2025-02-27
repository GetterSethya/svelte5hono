<script lang="ts">
	import { Client } from '@/client';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import * as Form from '@/components/ui/form/';
	import { LocalUser } from '@/local-user';
	import { updateUserValidator } from '@root/lib/validator/user-validator';
	import { onMount } from 'svelte';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { SaveIcon } from 'lucide-svelte';
	import { ICON_SIZE } from '@/constant';
	import { createMutation } from '@tanstack/svelte-query';
	import { z } from 'zod';
	import { appFetch } from '@/appFetch';
	import { JWT } from '@/jwt';
	import { ResponseError } from '@/utils';
	import { toast } from 'svelte-sonner';

	type UpdateFormProps = {
		data: SuperValidated<Infer<typeof updateUserValidator>>;
	};

	let { data }: UpdateFormProps = $props();

	const user = LocalUser.getCtx();
	const client = Client.getCtx();

	const updateMutation = createMutation({
		mutationFn: async (data: z.infer<typeof updateUserValidator>) => {
			const response = await client.user.index.$patch(
				{
					form: data
				},
				{
					init: { headers: { Authorization: JWT.access! } },
					fetch: appFetch
				}
			);

			const resData = await response.json();

			if (response.status !== 200 || !resData.result) {
				throw new ResponseError(response.status, null, resData.message || 'Update user failed');
			}

			return resData.result;
		},
		onSuccess: (data) => {
			toast.success('Update user success');
			user.set(data);
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
		resetForm: false,
		validators: zodClient(updateUserValidator),
		SPA: true,
		onUpdate: async ({ form: fd }) => {
			if (fd.valid) {
				$updateMutation.mutate(fd.data);
			}
		}
	});

	const { form: formData, enhance, reset } = form;

	onMount(() => {
		reset({
			data: { name: $user.name }
		});
	});
</script>

<div class="mb-2.5 flex flex-col gap-2.5">
	<Label>Email</Label>
	<Input disabled readonly bind:value={$user.email} />
</div>

<form method="POST" use:enhance class="flex flex-col">
	<Form.Field {form} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<div class="flex flex-col gap-2.5">
					<Form.Label>Name</Form.Label>
					<Input {...props} bind:value={$formData.name} placeholder="Profile name" />
				</div>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors class="font-normal" />
	</Form.Field>

	<Form.Button class="my-2.5 ms-auto w-fit" disabled={$updateMutation.isPending}>
		<span>Save</span>
		<SaveIcon size={ICON_SIZE} />
	</Form.Button>
</form>
