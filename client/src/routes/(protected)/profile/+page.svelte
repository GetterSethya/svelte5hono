<script lang="ts">
	import UpdateForm from './update-form.svelte';

	let { data } = $props();
</script>

<div class="flex-col flex w-full gap-2.5">
	<div class="flex flex-col">
		<span class="text-xl font-medium">Profile</span>
		<span class="text-foreground/60">Manage your profile information</span>
	</div>

	<UpdateForm data={data.form} />
</div>
