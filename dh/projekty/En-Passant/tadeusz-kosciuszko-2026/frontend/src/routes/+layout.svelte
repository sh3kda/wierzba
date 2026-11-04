<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/faviconDark.svg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}

<footer class="site-footer">
	<div class="footer-inner">
		<div class="footer-left">
			<span class="footer-brand">en Passant</span>
			<span class="footer-tagline">Projekt edukacyjny z zakresu cyberbezpieczeństwa</span>
		</div>
		<div class="footer-links">
			<a class="footer-link" href={import.meta.env.VITE_REPO_URL} target="_blank" rel="noopener noreferrer">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
					<path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
				</svg>
				Repozytorium
			</a>
			<span class="footer-sep">·</span>
			<a class="footer-link" href={import.meta.env.VITE_KOSCIUSZKON_URL} target="_blank" rel="noopener noreferrer">Kościuszkon</a>
		</div>
		<div class="footer-right">
			<span class="footer-copy">&copy; 2026 en Passant</span>
		</div>
	</div>
</footer>

<style>
.site-footer {
	width: 100%;
	background: #1e2130;
	border-top: 1px solid rgba(106, 117, 155, 0.25);
	padding: 1.5rem 2rem;
}

.footer-inner {
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 1rem;
	max-width: 1200px;
	margin: 0 auto;
	font-family: 'Inter', sans-serif;
	font-size: 0.88rem;
}

.footer-left {
	display: flex;
	flex-direction: column;
	gap: 0.2rem;
}

.footer-brand {
	font-family: 'Georgia', 'Palatino Linotype', serif;
	font-style: italic;
	font-weight: 700;
	font-size: 1.1rem;
	color: #a0aacc;
}

.footer-tagline {
	color: #5a6487;
	font-size: 0.82rem;
}

.footer-links {
	display: flex;
	align-items: center;
	gap: 0.6rem;
}

.footer-link {
	display: inline-flex;
	align-items: center;
	gap: 0.35rem;
	color: #7a85aa;
	text-decoration: none;
	font-weight: 500;
	transition: color 0.2s;
}

.footer-link:hover {
	color: #a0aacc;
}

.footer-sep {
	color: #3a4060;
}

.footer-right {
	color: #3a4060;
	font-size: 0.82rem;
}
</style>
