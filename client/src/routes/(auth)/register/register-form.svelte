<script lang="ts">
	import { goto } from '$app/navigation';
	import { Client } from '@/client';
	import * as Form from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import { registerMutation } from '@/mutation/register';
	import { registerValidator } from '@root/lib/validator/auth-validator';
	import { toast } from 'svelte-sonner';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	type RegisterFormProps = {
		data: SuperValidated<Infer<typeof registerValidator>>;
	};

	const client = Client.getCtx();
	const mutation = registerMutation(client);

	let { data }: RegisterFormProps = $props();

	const form = superForm(data, {
		validationMethod: 'auto',
		SPA: true,
		resetForm: false,
		validators: zodClient(registerValidator),
		onUpdate: ({ form: fd }) => {
			if (fd.valid) {
				$mutation.mutate(fd.data, {
					onSuccess: () => {
						toast.success('User Registered');
						goto('/login');
					}
				});
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

<form class="w-full" method="POST" use:enhance>
	<Form.Field {form} name="email">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Email</Form.Label>
				<Input {...props} bind:value={$formData.email} placeholder="Email@email.com" type="email" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors class="font-normal" />
	</Form.Field>

	<Form.Field {form} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Name</Form.Label>
				<Input placeholder="Input your name" {...props} bind:value={$formData.name} type="text" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors class="font-normal" />
	</Form.Field>
	<Form.Field {form} name="password">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Password</Form.Label>
				<Input
					placeholder="Input your password"
					{...props}
					bind:value={$formData.password}
					type="password"
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors class="font-normal" />
	</Form.Field>
	<Form.Field {form} name="passwordConfirm">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Confirm Password</Form.Label>
				<Input
					placeholder="Confirm your password"
					{...props}
					bind:value={$formData.passwordConfirm}
					type="password"
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors class="font-normal" />
	</Form.Field>
	<Form.Button disabled={$mutation.isPending} class="my-2.5 w-full">Register</Form.Button>
</form>
