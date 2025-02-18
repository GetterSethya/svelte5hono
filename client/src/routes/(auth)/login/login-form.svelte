<script lang="ts">
	import { goto } from '$app/navigation';
	import { Client } from '@/client';
	import * as Form from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import { JWT } from '@/jwt';
	import { loginMutation } from '@/mutation/login';
	import { loginValidator } from '@root/lib/validator/auth-validator';
	import { toast } from 'svelte-sonner';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	type LoginFormProps = {
		data: SuperValidated<Infer<typeof loginValidator>>;
	};

	const client = Client.getCtx();
	const mutation = loginMutation(client);

	let { data }: LoginFormProps = $props();

	const form = superForm(data, {
		validationMethod: 'auto',
		SPA: true,
		resetForm: false,
		validators: zodClient(loginValidator),
		onUpdate: ({ form: fd }) => {
			if (fd.valid) {
				$mutation.mutate(fd.data, {
					onSuccess: ({access_token,refresh_token}) => {
						localStorage.setItem(JWT.ACCESS_TOKEN,access_token);
						localStorage.setItem(JWT.REFRESH_TOKEN,refresh_token);
						toast.success('Login success');
						goto('/');
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
	<Form.Button disabled={$mutation.isPending} class="my-2.5 w-full">Login</Form.Button>
</form>
