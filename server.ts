/**
 * > **caution**
 * > `auth-astro` is currently experimental. Be aware of breaking changes between versions.
 *
 *
 * Astro Auth is the unofficial Astro integration for Auth.js.
 * It provides a simple way to add authentication to your Astro site in a few lines of code.
 *
 * ## Installation
 *
 * `auth-astro` requires building your site in `server` mode with a platform adaper like `@astrojs/node`.
 * ```js
 * // astro.config.mjs
 * export default defineConfig({
 *   output: "server",
 *   adapter: node({
 *     mode: 'standalone'
 *   })
 * });
 * ```
 *
 * ```bash npm2yarn2pnpm
 * npm install @auth/core @auth/astro
 * ```
 */
import { Auth } from '@auth/core'
import type { AuthAction, Session } from '@auth/core/types'
import authConfig from 'auth:config'

const actions: AuthAction[] = [
	'providers',
	'session',
	'csrf',
	'signin',
	'signout',
	'callback',
	'verify-request',
	'error',
]

function AstroAuthHandler(prefix: string, options = authConfig) {
	return async ({ request }: { request: Request }) => {
		console.log(request.url)
		const url = new URL(request.url)
		const action = url.pathname.slice(prefix.length + 1).split('/')[0] as AuthAction

		if (!actions.includes(action) || !url.pathname.startsWith(prefix + '/')) return
		const res = await Auth(request, options)
		return res
	}
}

/**
 * Creates a set of Astro endpoints for authentication.
 *
 * @example
 * ```ts
 * export const { GET, POST } = AstroAuth({
 *   providers: [
 *     GitHub({
 *       clientId: process.env.GITHUB_ID!,
 *       clientSecret: process.env.GITHUB_SECRET!,
 *     }),
 *   ],
 *   debug: false,
 * })
 * ```
 * @param config The configuration for authentication providers and other options.
 * @returns An object with `GET` and `POST` methods that can be exported in an Astro endpoint.
 */
export function AstroAuth(options = authConfig) {
	// @ts-ignore
	const { AUTH_SECRET, AUTH_TRUST_HOST, VERCEL, NODE_ENV } = import.meta.env

	options.secret ??= AUTH_SECRET
	options.trustHost ??= !!(AUTH_TRUST_HOST ?? VERCEL ?? NODE_ENV !== 'production')

	const { prefix = '/api/auth', ...authOptions } = options

	const handler = AstroAuthHandler(prefix, authOptions)
	return {
		async get(event: any) {
			return await handler(event)
		},
		async post(event: any) {
			console.log(event)
			return await handler(event)
		},
	}
}

/**
 * Fetches the current session.
 * @param req The request object.
 * @returns The current session, or `null` if there is no session.
 */
export async function getSession(req: Request, options = authConfig): Promise<Session | null> {
	// @ts-ignore
	options.secret ??= import.meta.env.AUTH_SECRET
	options.trustHost ??= true

	const url = new URL(`${options.prefix}/session`, req.url)
	const response = await Auth(new Request(url, { headers: req.headers }), options)

	const { status = 200 } = response

	const data = await response.json()

	if (!data || !Object.keys(data).length) return null
	if (status === 200) return data
	throw new Error(data.message)
}
