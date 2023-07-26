import type { AuthConfig } from '@auth/core'
import type { PluginOption } from 'vite'

export const virtualConfigModule = (configFile: string = './auth.config'): PluginOption => {
	const virtualModuleId = 'auth:config'
	const resolvedId = '\0' + virtualModuleId
	return {
		name: 'auth-astro-config',
		resolveId: (id) => {
			if (id === virtualModuleId) {
				return resolvedId
			}
		},
		load: (id) => {
			if (id === resolvedId) {
				return `export {default} from "${configFile}";`
			}
		},
	}
}

export interface AstroAuthConfig {
	/**
	 * Defines the base path for the auth routes.
	 * @default '/api/auth'
	 */
	prefix?: string
	/**
	 * Defineds wether or not you want the integration to handle the API routes
	 * @default true
	 */
	injectEndpoints?: boolean
	/**
	 * Path to the config file
	 */
	configFile?: string
}
export interface FullAuthConfig extends AstroAuthConfig, AuthConfig {}

/**
 * Convenience function used to provide autocomplete and type safety to the auth configuration without using JSDoc notations or explicit TypeScript annotations. Does not change anything functionally
 * @param config Configuration
 * @returns The configuration passed
 * @example
 * auth.config.ts
 * ```js
 * export default defineConfig({
 *   providers: [
 *     GitHub({
 *      clientId: import.meta.env.GITHUB_ID,
 *      clientSecret: import.meta.env.GITHUB_SECRET
 *     })
 *   ],
 *   session: {
 *     strategy: 'jwt'
 *   }
 * });
 * ```
 */
export const defineConfig = (config: FullAuthConfig) => config
