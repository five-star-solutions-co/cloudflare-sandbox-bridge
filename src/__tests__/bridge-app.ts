/**
 * Test adapter — Worker fetch wrapper around @cloudflare/sandbox/bridge.
 */
import { bridge } from '@cloudflare/sandbox/bridge'

const worker = bridge({})

type WorkerFetch = (request: Request, env: Env, ctx: ExecutionContext) => Response | Promise<Response>

export const app = {
	request(input: string, init?: RequestInit, env?: Record<string, unknown>) {
		const fetch = worker.fetch as WorkerFetch | undefined
		if (!fetch) {
			throw new Error('bridge() did not return a fetch handler')
		}

		return fetch(
			new Request(input, init),
			env as Env,
			{
				waitUntil() {},
				passThroughOnException() {},
				props: {}
			} as ExecutionContext
		)
	}
}
