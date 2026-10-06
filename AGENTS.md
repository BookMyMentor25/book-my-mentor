# Architecture rules

- Keep Live Project protected fields behind the `list_live_projects()` RPC and render them only when it returns `unlocked: true`, because browser-side masking would expose company and contact data.