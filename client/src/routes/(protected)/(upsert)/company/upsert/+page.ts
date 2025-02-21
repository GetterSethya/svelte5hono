import { superValidate } from 'sveltekit-superforms';
import type { PageLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { companyValidator } from '@root/lib/validator/company-validator';

export const load: PageLoad = async () => {
	return {
		form: await superValidate(zod(companyValidator))
	};
};
