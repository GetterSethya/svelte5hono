<script lang="ts">
	import UpdateForm from './update-form.svelte';

	let { data } = $props();
</script>

<UpdateForm data={data.form}></UpdateForm>
