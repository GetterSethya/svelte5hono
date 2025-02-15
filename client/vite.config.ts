import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const PROD = import.meta.env?.PROD ?? false

export default defineConfig({
	plugins: [sveltekit()],
	// bair diberkati dewi pemrograman
	server: { port: 1437 ,
        proxy:{
            "/api":{
                target:PROD ? "/" : "http://localhost:3000/",
                changeOrigin :true,
            }
        }
    },
	preview: { port: 1438 }
});
