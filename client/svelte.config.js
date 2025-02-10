import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		prerender: {
			handleMissingId: 'warn'
		},
		adapter: adapter({
			pages: '../src/static/',
			assets: '../src/static/',
			fallback: undefined,
			strict: true
		}),
		alias: {
			'@/*': './src/lib/*',
			'@root/*': '../src/*'
		}
	}
};

export default config;
