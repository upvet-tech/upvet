<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.

<!-- LOVABLE:END -->

## Application architecture

- Keep the shared application shell and demonstration state in a client-side provider; this initial visual stage must not require external services or persistent storage.
- Give each module its own typed route and metadata, reusing a common module view for initial demonstration navigation.
- Define operational dashboard metric types separately from financial data so reception views cannot expose financial metrics.
- Signed-in pages live under `src/routes/_authenticated/` (client-only gate via Supabase `getUser`) and the app shell renders in that layout; `/auth` and `/reset-password` stay public. Why: login pages must render without the shell and protected pages must never render signed out.
- Finance authorization uses an authenticated server function and the database's clinic-scoped boolean RPC; client roles never authorize access. Why: both direct calls and page loads must enforce tenant permissions.
- Register the app-owned bearer attacher in Start's function middleware without replacing request middleware. Why: external Supabase sessions must reach authenticated server functions while preserving CSRF protection.
- Keep clinic role and active-membership RLS helpers SECURITY DEFINER with an empty search path, auth.uid-bound queries and no writes; other access helpers use SECURITY INVOKER. Why: avoid recursive policies without granting arbitrary privileged operations.
