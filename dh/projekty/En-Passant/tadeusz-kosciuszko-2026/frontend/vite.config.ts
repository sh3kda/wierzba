import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
			// Przekierowuje zapytania z frontendu (np. /api/users) do Springa
			'/api': {
				target: 'http://localhost:8080',
				changeOrigin: true
			}
		}
	}
});