# components/

UI components, organized as PascalCase folders:

| Folder | Contents |
|---|---|
| `Auth/` | Route guards: `PrivateRoute.tsx` (bounce to `/login` when `localStorage.token` is missing), `PublicRoute.tsx` (bounce to `/board` when already signed in) |
| `Header/` | `Header.tsx` lives in `SharedComponents`; this folder holds the header's dropdowns — `ProfileDropdown.tsx` and `WorkSpaceProjectDropdown.tsx` (workspace/project switcher) |
| `HomeComponents/` | The board: `Kanban/Kanban.tsx` plus its `Kanban/components/` — `TaskCard.tsx` and `DroppableColumn.tsx` (`@dnd-kit`) |
| `Inbox/` | `WorkspaceInviteNotification.tsx` — accept/decline flow for invitations |
| `SharedComponents/` | App-wide, reused across pages (see below) |
| `Skeleton/` | `glass-skeleton` shimmering placeholders — `KanbanSkeleton.tsx`, `WorkspaceSkeleton.tsx` |
| `UserComponents/LandingPageComponent/` | `Login.tsx`, `Signup.tsx` (confirm-password field) and `ForgotPassword.tsx`, the tabs/states `AuthPage` mediates between |

## SharedComponents (verbatim rules)

- **`Modal.tsx`** — all dialogs go through it. It portals to `document.body`,
  handles Escape-to-close (via `utils/useEscapeToClose`), the body scroll lock
  and initial focus. Never hand-roll `fixed inset-0` inside a glass surface —
  `backdrop-filter` makes the ancestor a containing block, so an inline dialog
  renders as a strip near the top instead of centred. Shipped once; keep the portal.
- **`ConfirmationDialog.tsx`** — destructive-action confirm, on `glass-strong`.
- **`CreateItemModal.tsx`**, **`CreateWorkSpace.tsx`** — creation flows.
- **`InviteMemberModal.tsx`** — debounced email search with a cancel guard; keep
  the debounce.
- **`PhotoPicker.tsx`**, **`PhotoUploadModal.tsx`** — images via Cloudinary,
  rendered through `utils/media.ts#resolveMediaUrl` (never concatenate
  `VITE_API_URL` yourself). Unconfigured backend returns 503 — show a message
  naming the missing config, not a generic failure.
- **`Avatar.tsx`** — initials fallback when `photoUrl` is null.
- **`Header.tsx`** — top nav (workspace/project dropdown, search, profile).
- **`Docker.tsx`** — fixed bottom nav rail on mobile.

## Component rules

- `export default function Name() {}` + `type XProps` above.
- Every async action sets a loading flag that disables its button, guards
  re-entry and disables sibling controls. No mutation stays clickable in flight.
- Toasts via `react-hot-toast`; icons via `lucide-react` sized in JSX.
- Modals/dropdowns float at `z-[100]` (brackets required; `z-100` is invalid).
- Status/priority literals come from `interface/taskInterface.ts`
  (`TASK_STATUSES`, `TASK_PRIORITIES`) — never re-hardcode.
