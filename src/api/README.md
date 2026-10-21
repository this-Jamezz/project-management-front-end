# api/

One file per backend domain. Each wrapper calls `fetchWithAuth`, then unwraps
**the envelope key its domain uses** before returning.

| File | Domain | Envelope on success |
|---|---|---|
| `workspaceApi.ts` | `/api/workspace` | `{ success, data }` → return `data` |
| `worspaceInvitationApi.ts` | `/api/workspace-invitation` | `{ success, data }` → `data` |
| `projectApi.ts` | `/api/project` | `{ success, projects }` → `projects` |
| `taskApi.ts` | `/api/task` | `{ success, tasks }` → `tasks` |
| `notificationApi.ts` | `/api/notification` | `{ success, notifications }` → `notifications` |
| `userApi.ts` | `/api/users` | `{ success, ... }` |
| `aiApi.ts` | `/api/ai` | AI subtask generation |
| `photoApi.ts` | photo endpoints | upload progress/URLs |

## Rules

- Always unwrap the right envelope key — check the controller before writing
  the wrapper. Error status: `throw new Error(message)`; the component toasts it.
- Types come from `../interface/*`, never re-declared locally.
- `projectApi.getWorkspaceProjects` and `workspaceApi.addMember` are dead code —
  their backend callers are dead too.

## The filename is misspelled on purpose

`worspaceInvitationApi.ts` (missing "space") is imported by
`WorkspaceInviteNotification`, `InviteMemberModal` and others. Renaming means
touching every importer — do it as one commit, or not at all.
