<script lang="ts">
	import { buttonVariants } from '@/components/ui/button';
	import RegisterForm from './register-form.svelte';

	let { data } = $props();
</script>

<div class="w-1/2 lg:w-1/3">
	<h1 class="my-2.5 text-4xl font-medium">Lets get started</h1>
	<RegisterForm data={data.form} />
	<span>
		Already have an account?
		<a href="/login" class={buttonVariants({ variant: 'link', class: 'p-0' })}> Login </a>
	</span>
</div>
