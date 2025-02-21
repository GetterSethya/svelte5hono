<script lang="ts">
	import { companyValidator } from '@root/lib/validator/company-validator';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Form from '@/components/ui/form';
	import { Input } from '@/components/ui/input';
	import Textarea from '@/components/ui/textarea/textarea.svelte';
	import { SaveIcon } from 'lucide-svelte';
	import { ICON_SIZE } from '@/constant';
	import { upsertMutation } from '@/mutation/company';
	import { Client } from '@/client';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { upsertQuery } from '@/query/company';

	type UpsertFormProps = {
		data: SuperValidated<Infer<typeof companyValidator>>;
		id?: string;
	};

	let { id, data }: UpsertFormProps = $props();

	const client = Client.getCtx();
	const upsertCompanyMutation = upsertMutation(client);
	const upsertCompanyQuery = upsertQuery(client, id);

	const form = superForm(data, {
		validationMethod: 'auto',
		validators: zodClient(companyValidator),
		SPA: true,
		onUpdate: async ({ form: fd }) => {
			if (fd.valid) {
				$upsertCompanyMutation.mutate(fd.data, {
					onSuccess: () => {
						toast.success(id ? 'Update company success' : 'Create company success');
						goto('/company');
					}
				});
			}
		}
	});

	const { form: formData, enhance, reset } = form;

	$effect(() => {
		const res = $upsertCompanyQuery.data?.result;
		if (res) {
			reset({ data: { ...res } });
		}
	});
</script>

<form method="POST" use:enhance class="flex flex-col">
	<Form.Field {form} name="name">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Name</Form.Label>
				<Input {...props} bind:value={$formData.name} placeholder="Input company name" />
			{/snippet}
		</Form.Control>
		<Form.Description />
		<Form.FieldErrors class="font-normal" />
	</Form.Field>

	<Form.Field {form} name="address">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Address</Form.Label>
				<Textarea {...props} bind:value={$formData.address} />
			{/snippet}
		</Form.Control>
		<Form.Description />
		<Form.FieldErrors class="font-normal" />
	</Form.Field>
	<Form.Button class="my-2.5 ms-auto">
		<span class="flex flex-row items-center gap-2.5">
			<span>Save</span>
			<SaveIcon size={ICON_SIZE} />
		</span>
	</Form.Button>
</form>
