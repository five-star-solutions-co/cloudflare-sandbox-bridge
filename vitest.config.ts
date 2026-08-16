import { cloudflareTest } from '@cloudflare/vitest-pool-workers'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [
		cloudflareTest({
			wrangler: { configPath: './wrangler.jsonc' }
		})
	],
	test: {
		// Route tests still target unpublished sandbox-sdk internals (createBridgeApp / getSandbox mocks).
		include: [
			'src/__tests__/resolveWorkspacePath.test.ts',
			'src/__tests__/shellQuote.test.ts',
			'src/__tests__/warm-pool.test.ts'
		]
	}
})
