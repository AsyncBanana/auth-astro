declare module 'auth:config' {
	const config: import('./src/config').FullAuthConfig
	export default config
}

declare module '@convocomet/auth-astro' {
	const index: import('./index').Integration
	const defineConfig: (config: import('./src/config').FullAuthConfig) => ConfigEnv
	export default index
	export { defineConfig }
}
