<script lang="ts">
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { updatePasswordValidator } from '@root/lib/validator/auth-validator';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Form from '@/components/ui/form/';
	import { Input } from '@/components/ui/input';
	import { SaveIcon } from 'lucide-svelte';
	import { ICON_SIZE } from '@/constant';
	import { createMutation } from '@tanstack/svelte-query';
	import { z } from 'zod';
	import { Client } from '@/client';
	import { JWT } from '@/jwt';
	import { appFetch } from '@/appFetch';
	import { ResponseError } from '@/utils';
	import { toast } from 'svelte-sonner';

	type UpdateFormProps = {
		data: SuperValidated<Infer<typeof updatePasswordValidator>>;
	};

	let { data }: UpdateFormProps = $props();
	const client = Client.getCtx();

	const updateMutation = createMutation({
		mutationFn: async (data: z.infer<typeof updatePasswordValidator>) => {
			const response = await client.authentication.password.$patch(
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
				throw new ResponseError(response.status, null, resData.message || 'Update password failed');
			}

			return resData.result;
		},
		onSuccess: () => {
			toast.success('Update password success');
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
		SPA: true,
		resetForm: false,
		validators: zodClient(updatePasswordValidator),
		onUpdate: async ({ form: fd }) => {
			if (fd.valid) {
				$updateMutation.mutate(fd.data);
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance class="flex flex-col">
	<Form.Field {form} name="currentPassword">
		<Form.Control>
			{#snippet children({ props })}
				<div class="flex flex-col gap-2.5">
					<Form.Label>Current Password</Form.Label>
					<Input
						{...props}
						bind:value={$formData.currentPassword}
						placeholder="Your current password"
						type="password"
					/>
				</div>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors class="text-xs font-normal" />
	</Form.Field>
	<Form.Field {form} name="newPassword">
		<Form.Control>
			{#snippet children({ props })}
				<div class="flex flex-col gap-2.5">
					<Form.Label>New Password</Form.Label>
					<Input
						{...props}
						bind:value={$formData.newPassword}
						placeholder="Your new password"
						type="password"
					/>
				</div>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors class="text-xs font-normal" />
	</Form.Field>
	<Form.Field {form} name="passwordConfirm">
		<Form.Control>
			{#snippet children({ props })}
				<div class="flex flex-col gap-2.5">
					<Form.Label>Password Confirm</Form.Label>
					<Input
						{...props}
						bind:value={$formData.passwordConfirm}
						placeholder="Confirm your password"
						type="password"
					/>
				</div>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors class="text-xs font-normal" />
	</Form.Field>
	<Form.Button disabled={$updateMutation.isPending} class="my-2.5 ms-auto">
		<span class="flex flex-row items-center gap-2.5">
			<span>Save</span>
			<SaveIcon size={ICON_SIZE} />
		</span>
	</Form.Button>
</form>
