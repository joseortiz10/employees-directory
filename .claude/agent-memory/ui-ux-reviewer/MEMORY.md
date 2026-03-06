# UI/UX Reviewer Agent Memory

## App Structure
- Route: `/employees` renders `EmployeeListPage.tsx` (NOT `EmployeesPage.tsx` + `EmployeesTable.tsx` — those are a secondary/unused variant)
- Active employee list is in `src/features/employees/presentation/EmployeeListPage.tsx`
- Status badge component: `src/shared/components/StatusBadge.tsx`
- "View" navigates to `EmployeeDetailPage`; "Add Employee" goes to a create form page (not a modal)

## Status Badge Design (confirmed)
- Active: `bg-green-100 text-green-800` pill + `bg-green-500` dot (6px circle)
- Inactive: `bg-red-100 text-red-800` pill + `bg-red-500` dot
- Size: 59.75×19.99px — below 44px minimum touch target (WCAG 2.5.5)
- Text is 12px (`text-xs`) — confirmed low contrast risk on light backgrounds
- Badge does include text label alongside the color dot (partial WCAG 1.4.1 pass)
- No `aria-label` on the badge; status text visible to screen readers via text content

## Table Layout (confirmed)
- File: `EmployeeListPage.tsx` — inlines TanStack Table directly (not extracted to EmployeesTable.tsx)
- Columns: Full Name, Email, Position, Department, Status, Actions
- Row class: `border-b hover:bg-gray-50` — hover state EXISTS but is very subtle (gray-50 barely perceptible)
- Cell padding: `px-4 py-3` (16px / 12px)
- Row height: ~64.8px
- Header: `bg-gray-50`, `text-sm font-medium text-gray-700`
- Table: `w-full border-collapse bg-white shadow rounded`
- No `<caption>`, no `aria-label` on `<table>`, no `scope` on `<th>` elements

## Accessibility Issues Found
- No `<caption>` or `aria-label` on the `<table>` element
- No `scope="col"` on `<th>` elements
- No skip navigation link
- Focus indicator: thin browser-default outline on action buttons only (barely visible)
- Action buttons are 28px tall — below 44px WCAG 2.5.5 minimum touch target
- Document title is generic: "employees-directory" (not descriptive)
- `+ Add Employee` button has no `aria-label` (the + prefix could be confusing to screen readers)
- Status badge dot `<span>` has no `aria-hidden="true"`
- Employee name cells are plain text, not links (View action hidden in Actions column only)

## Mobile Behavior (375px viewport)
- Table overflows horizontally: table is 783px wide, container is only 296px
- `overflow-x-auto` is applied to wrapper div — table scrolls but only 2 columns visible without scrolling
- No responsive card layout or column hiding at small viewports
- Buttons (View/Delete) are not visible in initial viewport at 375px

## Action Buttons
- "View": blue `bg-blue-600`, 53.5×28px — below 44px height
- "Delete": red `bg-red-600`, 63.9×28px — below 44px height
- Both lack `aria-label` (just the text "View" / "Delete" — ambiguous for screen readers: "View what?")
- No confirmation dialog before Delete (destructive action)

## Data Quality Issue Observed
- Two duplicate employee records for "José Ortiz Cruz" with same email `jose.ortiz@apsys.mx`
- One has position "Ejmplo" (likely typo for "Ejemplo" or a test entry)
- No start date column visible in table (present in detail view)
