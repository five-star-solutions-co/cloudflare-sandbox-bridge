# cloudflare-sandbox-bridge

Cloudflare Worker that exposes the sandbox HTTP API. Repository rules add tooling and env constraints only.

## Tooling

- Use Bun and the existing scripts.
- Root gate is `bun run check` (`format:check` + type-aware `lint` + vitest). Standalone oxfmt/oxlint passes are not substitutes.
- Before that root check, format only session-touched paths (`oxfmt --write <paths>`). Never run repo-wide `oxfmt --write .` or `bun run format` during a later session. This adoption change is the exception.
- `oxlint-tsgolint` is required for type-aware lint. Do not remove it.
- `worker-configuration.d.ts` is generated. After `wrangler.jsonc` or env-key changes, tell the user to run `bun run types`. Agents never run `wrangler`.

## Environment files

- Templates live in `.env.example` only. Runtime files are `.env.development` and `.env.production`, with committed companions `.env.development.encrypted` and `.env.production.encrypted`.
- Never commit decrypted env files or `.env.keys`. Never invent secret values.
- `SANDBOX_API_KEY` is the Worker secret. Other keys in the env files are Worker vars.
- `sync-env` classifies `SANDBOX_API_KEY` as a secret and writes the rest into `wrangler.jsonc` `vars`.

## Deploy

Pushes to `main` publish the sandbox image once, then deploy development and production. That is the intended policy for this repo. Do not change the workflow back to development-only on push.

Named environments use a Cloudflare registry `sha-<7>` tag. `:latest` is rejected. Top-level `containers[].image` stays `./Dockerfile` for local `wrangler dev`. Agents never run `wrangler containers push`.

## Banned commands

Agents never run deploy, Wrangler, Cloudflare, or secret-sync commands. That includes `wrangler`, `bun run deploy`, `bun run dev`, `bun run types`, `bun run env:sync`, and `bun run env:encrypt`. Print the exact user-owned command instead.

Decrypt is allowed when the encrypted files and keys already exist (`bun run env:decrypt`).
