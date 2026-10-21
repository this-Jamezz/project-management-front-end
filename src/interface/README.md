# interface/

TypeScript types and shared constants. **Types only plus a few const maps —
no behaviour, no imports from components.**

## Files

- `taskInterface.ts` — the `Task` type plus the only source of truth for
  enum-ish values: `TASK_STATUSES`, `TASK_PRIORITIES`, and the styling maps
  keyed by them (`STATUS_ACCENT_BG`, `STATUS_ACCENT_TEXT`, `PRIORITY_STRIPE`).
  Always `import type` / import the const — never re-hardcode `"TODO"` or
  `"HIGH"` in a component.
- `workspaceInteface.ts` — `Workspace`, `WorkspaceMember`, `WorkspaceOwner`.
- `projectInterface.ts` — `Project`.
- `notifactionInterface.ts` — `Notification`.

## Field notes carried from the schema

- `photoUrl` on `User` and `Workspace` is an **absolute Cloudinary URL** — render
  it through `utils/media.ts#resolveMediaUrl`, not by prefixing `VITE_API_URL`.
- `Task.status` is a string, `Task.priority` is the enum; only the constants in
  `taskInterface.ts` know the allowed strings.

### Historical misspellings are load-bearing

`notifactionInterface.ts` and `workspaceInteface.ts` (saved filenames) are
imported across the app. Renaming is fine only if every importer changes in the
same commit.

## Conventions

- With `verbatimModuleSyntax`, consumers must use `import type { X } from ...`.
- Envelope types match the backend (`../back_end/src/controllers`); if you
  change a payload, change both ends.
