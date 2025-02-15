<script lang="ts">
	import { buttonVariants } from '@/components/ui/button';
	import LoginForm from './login-form.svelte';

	let { data } = $props();
</script>

<div class="w-1/2 lg:w-1/3">
	<h1 class="my-2.5 text-4xl font-medium">Complete the form bellow to continue</h1>
	<LoginForm data={data.form} />
	<span>
		Dont have an account?
		<a href="/register" class={buttonVariants({ variant: 'link', class: 'p-0' })}>Register</a>
	</span>
</div>
