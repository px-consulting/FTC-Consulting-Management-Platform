# FTC Consulting Management Platform – Design System

This document defines the UI foundations and component guidelines for the FTC-CMP project.

## 1. Color Tokens

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `primary` | `#0B5CAB` | `#0EA5E9` | Buttons, links, highlights |
| `secondary` | `#1E73BE` | `#1E73BE` | Secondary actions, tabs |
| `accent` | `#0EA5E9` | `#14B8A6` | Informational accents |
| `teal` | `#14B8A6` | `#14B8A6` | Success, active states |
| `background` | `#FFFFFF` | `#0F172A` | App background |
| `foreground` | `#0F172A` | `#F8FAFC` | Base text color |
| `muted` | `#F1F5F9` | `#334155` | Surfaces, borders |
| `muted-foreground` | `#64748B` | `#94A3B8` | Secondary text |
| `destructive` | `#DC2626` | `#F87171` | Error states |

Gradients: brand hero backgrounds use a linear gradient from `#0B5CAB` → `#0EA5E9` with a teal (`#14B8A6`) overlay at 30%.

## 2. Typography

| Style | Font | Sizes (px) | Weight |
|-------|------|-----------|--------|
| Headings | Inter | 40, 32, 24, 20, 16 | 700/600 |
| Body | Roboto | 16, 14, 12 | 400/500 |
| Mono | System monospace | 14 | 400 |

## 3. Spacing, Radii & Shadows

- Spacing scale: 4 → 64px in 4px increments (`1` = 4px).
- Border radii: `sm` 4px, `md` 6px, `lg` 10px, `xl` 14px.
- Shadows: `sm` subtle 0 1px 2px rgba(0,0,0,.05); `md` 0 4px 8px rgba(0,0,0,.1); `lg` 0 10px 15px rgba(0,0,0,.15).

## 4. Motion

- Durations: 150ms (fast), 300ms (base), 500ms (slow).
- Easing: `ease-out` for entrance, `ease-in` for exit, `ease-in-out` for transitions.
- Use motion sparingly; respect `prefers-reduced-motion`.

## 5. Iconography & Illustration

- Icons: [lucide-react](https://lucide.dev) line icons, 1.5px stroke.
- Illustrations: minimal geometric shapes echoing the logo’s infinity curves.
- Keep icon buttons 40×40px min for touch targets.

## 6. Layouts

### Login Page

- Centered card containing tabs for **User** and **Admin** login.
- FTC-CMP logo sits above the title “FTC Consulting Management Platform”.
- Responsive: full height flex container; card max‑width 360px.

### Admin Shell

- Top bar: left‑aligned “Welcome Admin” + right‑aligned Logout button.
- Tabs: `Manage Learnings`, `Manage Tutorials`, `Manage Users`.
- Content area uses padding 16–24px depending on breakpoint.

### User Shell (future)

- Dashboard with quick stats and resource library grid.

## 7. Component Inventory

- **Cards** – used for PDF/tutorial entries.
- **Modal Dialogs** – upload module/tutorial/user; use `dialog` shadcn component.
- **Table** – user management with status `Badge` and key icon for credentials.
- **Badges** – `active`, `inactive`, `expired` variants.
- **Form Controls** – inputs, selects, date pickers, file upload button.
- **YouTubePlayer** – embedded video with thumbnail preview.

## 8. Annotated Screens (textual)

1. **Login Screen** – logo, title, tabs for User/Admin, each tab shows respective form fields and a submit button.
2. **Admin › Manage Learnings** – list of learning modules with an “Add Module” button opening the upload dialog.
3. **Admin › Manage Tutorials** – grid of tutorial cards; selecting a card opens the `YouTubePlayer` modal.
4. **Admin › Manage Users** – table listing name, email, status `Badge`, and actions; “Add User” opens modal with form fields.

## 9. Example Code

### Tailwind Theme
```js
// tailwind.config.js
export default {
  theme: { extend: { colors: { /* tokens */ } } }
}
```

### Badge Component
```jsx
<Badge variant="active">Active</Badge>
```

### Admin Shell Skeleton
```jsx
<Tabs defaultValue="learnings">
  <TabsList>
    <TabsTrigger value="learnings">Manage Learnings</TabsTrigger>
    <TabsTrigger value="tutorials">Manage Tutorials</TabsTrigger>
    <TabsTrigger value="users">Manage Users</TabsTrigger>
  </TabsList>
  <TabsContent value="learnings" />
  <TabsContent value="tutorials" />
  <TabsContent value="users" />
</Tabs>
```

---
All tokens and examples comply with WCAG AA contrast and support keyboard and screen-reader navigation.
