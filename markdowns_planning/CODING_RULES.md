# Coding Rules & Principles

> This file is the law. Every piece of code written in this project must follow these rules without exception. When in doubt, do less, name better, and ask before inventing.

---

## 0. Mindset before writing any code

Before writing a single line, ask three questions:

1. **Does this already exist somewhere in the codebase?** If yes, reuse it.
2. **Will this actually be needed right now?** If not certain, do not build it.
3. **Can I explain what this does in one sentence?** If no, split it.

If all three pass — write the code.

---

## 1. SOLID

### S — Single Responsibility
Every file, function, and component does exactly one thing. If you need the word "and" to describe what something does, it does too much.

```ts
// WRONG
async function createUserAndSendWelcomeEmail(data) { ... }

// RIGHT
async function createUser(data) { ... }
async function sendWelcomeEmail(email: string) { ... }
```

- One component = one visual concern
- One service = one business domain
- One API route = one action
- One utility function = one transformation

### O — Open / Closed
Code is open for extension, closed for modification. Add behavior by adding new files — not by editing working ones.

```ts
// WRONG — every new type means editing this function
function getPrice(type: string) {
  if (type === 'basic') return 10;
  if (type === 'pro') return 30;
  // grows forever
}

// RIGHT — price lives on the record itself, fetched from the data source
// new types = new records, zero code changes
```

- Avoid long `if/else` or `switch` chains that grow as the business grows
- Use data to drive behavior, not hard-coded conditionals
- Extend via composition, not mutation of existing code

### L — Liskov Substitution
Any function that accepts a type must work correctly with any valid value of that type. Do not make assumptions beyond what is declared.

```ts
// WRONG — assumes the object always has a nested property
function getStatus(entity) {
  return entity.subscription.status; // crashes if subscription is null
}

// RIGHT — handles absence explicitly, accepts only what it needs
function getStatus(subscription: Subscription | null): Status {
  if (!subscription) return 'none';
  return subscription.status;
}
```

### I — Interface Segregation
Do not pass large objects into functions that only need a small part of them. Destructure at the boundary, pass only what is needed.

```ts
// WRONG — receives the entire object but uses two fields
<UserBadge user={user} />

// RIGHT — receives only what it renders
<UserBadge name={user.name} status={user.status} />
```

- Props and function parameters should be minimal and explicit
- API handlers should only read the fields they use from the request body
- Service functions receive primitive values or small typed objects, not full database records unless truly required

### D — Dependency Inversion
High-level logic must not depend on concrete low-level details. Depend on abstractions.

```ts
// WRONG — business logic imports the database client directly
import { db } from '@/lib/db';
async function getActiveUsers() {
  return db.from('users').select('*').eq('status', 'active');
}

// RIGHT — business logic calls a repository, repository owns the data access detail
// /repositories/user.repository.ts
export async function getActiveUsers(): Promise<User[]> { ... }

// /services/user.service.ts
import { getActiveUsers } from '@/repositories/user.repository';
```

- UI components never import database clients or raw queries
- API routes call services, services call repositories, repositories touch the database
- Every layer is independently testable and replaceable

---

## 2. KISS — Keep It Simple, Stupid

Simple code is not lazy code. It is the hardest code to write and the most valuable code to maintain.

**Rules:**

- If a developer unfamiliar with this codebase cannot understand a function in 30 seconds, rewrite it
- Prefer 10 lines of obvious code over 3 lines of clever code
- No nested ternaries — ever
- No chained optional access more than two levels deep (`a?.b?.c` is acceptable — `a?.b?.c?.d?.e` is not)
- Default to the most boring solution that works. Reach for complexity only when the simple solution provably fails.
- Comments explain **why**, not **what**. If you need a comment to explain what, the code is not simple enough.

```ts
// WRONG — clever, unreadable
const label = user?.role ? (user.role === 'admin' ? user.verified ? 'Admin' : 'Unverified Admin' : 'User') : 'Guest';

// RIGHT — readable, obvious
function resolveUserLabel(user: User | null): string {
  if (!user) return 'Guest';
  if (user.role !== 'admin') return 'User';
  return user.verified ? 'Admin' : 'Unverified Admin';
}
```

---

## 3. TDA — Tell, Don't Ask

Do not query an object for its state and then make a decision outside of it. Tell the object what to do and let it handle its own logic.

**The smell:** you are reading data from somewhere, then making a decision about that data somewhere else entirely.

```ts
// WRONG — asks for state externally, then decides
if (order.status === 'pending' && order.paymentConfirmed) {
  order.status = 'confirmed';
  await save(order);
}

// RIGHT — tells the order to confirm itself
await orderService.confirm(orderId);
```

**In practice:**

- Service functions make decisions. Components and API routes do not.
- A component never reads raw data fields and computes a derived value inline — it receives a pre-computed value from the service layer.
- An API route never contains business logic — it receives a request, calls a service, returns the result.

```ts
// WRONG — API route making a business decision
app.post('/orders/:id/confirm', async (req, res) => {
  const order = await getOrder(req.params.id);
  if (order.status === 'pending' && order.paymentConfirmed) {
    // logic here...
  }
});

// RIGHT — API route delegates completely
app.post('/orders/:id/confirm', async (req, res) => {
  const result = await orderService.confirm(req.params.id);
  res.json(result);
});
```

---

## 4. LoD — Law of Demeter

A unit of code should only talk to its immediate neighbors. Do not reach through objects to get to other objects.

> Only talk to your friends. Do not talk to strangers.

```ts
// WRONG — reaching through layers
const city = user.address.location.city.name;

// RIGHT — the service or a mapper resolves this
const city = userService.getUserCity(userId);
```

**Practical rules:**

- If you find yourself writing more than one `.` to access a value, consider whether a service or mapper should resolve it for you
- API responses should be flat and purpose-built for the consumer — not raw database records with nested relations
- A component does not navigate the full shape of a data model through props

```ts
// WRONG — raw nested record sent to the client
return { user, user.profile, user.profile.subscription, user.profile.subscription.plan }

// RIGHT — flat, purpose-built response
return {
  userId: user.id,
  name: user.profile.displayName,
  planName: user.profile.subscription.plan.name,
  status: user.profile.subscription.status,
}
```

---

## 5. DRY — Don't Repeat Yourself

Every piece of knowledge must have a single, authoritative representation in the codebase.

**DRY is about knowledge, not just copy-paste.** Two functions that look similar but represent different business concepts are not duplication. The same rule written twice in two places is a DRY violation.

```ts
// WRONG — the same logic expressed in two places
// In a component:
const isExpired = new Date(item.expiresAt) < new Date();

// In an API route:
if (new Date(record.expiresAt) < new Date()) { ... }

// RIGHT — one place owns this rule
// /lib/date.ts
export function isExpired(date: Date): boolean {
  return new Date(date) < new Date();
}
```

**Rules:**

- Validation logic lives in one place — not scattered across routes and components
- Formatting logic lives in a single utility — not written inline wherever it is displayed
- Status labels and styles are defined once in a constants file — referenced everywhere
- Any time you write the same logic twice — stop, extract, import

**What DRY does not mean:**

- Do not prematurely abstract two things that happen to look similar today — wait for the third occurrence before extracting
- Do not create a catch-all utility file that absorbs everything — organize by domain, not by convenience

---

## 6. YAGNI — You Aren't Gonna Need It

Do not build features, abstractions, or configurations that are not required right now by a real, existing requirement.

```ts
// WRONG — building a plugin system because "we might need it later"
class NotificationService {
  private plugins: NotificationPlugin[] = [];
  register(plugin: NotificationPlugin) { ... }
  dispatch(event: string, payload: unknown) {
    this.plugins.forEach(p => p.handle(event, payload));
  }
  // 60 lines of infrastructure nobody asked for
}

// RIGHT — send the notification, nothing more
async function sendExpiryNotification(email: string, itemName: string) {
  await mailer.send({ to: email, subject: `${itemName} is expiring`, ... });
}
```

**Rules:**

- No speculative generalization — build only for what the current requirements describe
- No configuration options that nothing currently uses
- No abstract base classes without at least two concrete implementations that exist right now
- No `// TODO: add support for X later` stubs that add code without behavior
- No placeholder files, empty interfaces, or skeleton classes for future features

**The test:** can you point to a current, real requirement that needs this code? If not, do not write it.

---

## 7. File & folder structure

```
/src
  /app              # Framework routing layer — pages and API handlers only
    /api            # API route handlers — no business logic here
  /components       # UI components
    /ui             # Primitive, reusable components (Button, Badge, Input...)
  /services         # Business logic — one file per domain
  /repositories     # Data access — one file per entity
  /lib              # Shared infrastructure (database client, mailer, auth config...)
  /types            # Shared TypeScript types and interfaces
  /constants        # Static values, enums, label maps
  /validations      # Input validation schemas
```

**Rules:**

- API routes import from `/services` only — never directly from `/repositories`
- Components never contain business logic and never import from `/repositories`
- `/lib` contains no business logic — only infrastructure setup and configuration
- Types are never defined inline inside components or route handlers — they live in `/types`
- Every new domain gets its own service file and repository file — never mix two domains in one file

---

## 8. Naming rules

Names are the most important documentation in the codebase. A good name makes a comment unnecessary.

| Thing | Convention | Examples |
|-------|-----------|---------|
| Functions | verb + noun | `getActiveUsers`, `sendExpiryEmail`, `assignRole` |
| Booleans | `is` / `has` / `can` prefix | `isExpired`, `hasAccess`, `canEdit` |
| Components | PascalCase noun | `UserCard`, `StatusBadge`, `PageHeader` |
| Files | kebab-case matching the export | `user.service.ts`, `status-badge.tsx` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_RETRY_COUNT`, `DEFAULT_PAGE_SIZE` |
| Types & Interfaces | PascalCase, no `I` prefix | `User`, `Subscription`, `ApiResponse` |
| Folders | kebab-case | `user-profile/`, `auth-flow/` |

**Never:**

- Abbreviate unless it is an industry-standard acronym (`id`, `url`, `api` are fine — `usr`, `cfg`, `mgr` are not)
- Use generic, meaningless names: `data`, `info`, `result`, `manager`, `helper`, `utils` without a domain qualifier
- Name a file `index.ts` unless it is a barrel export that is genuinely needed
- Use different words for the same concept in different parts of the codebase — pick one term and use it everywhere

---

## 9. TypeScript rules

- `strict: true` — always, no exceptions
- No `any` — use `unknown` and narrow it, or define a proper type
- All function parameters and return values are explicitly typed
- Types are derived from validation schemas using `z.infer<>` where applicable — do not write a separate type that duplicates a schema
- Prefer `type` over `interface` for object shapes — use `interface` only when extension via `extends` is genuinely needed
- Never use `as` type assertions to silence a type error — fix the type instead

---

## 10. What the agent must never do

- Add a library without a clear, existing requirement pointing to it
- Generate code for a feature not in the current requirements
- Put business logic in a component, a page, or an API route handler
- Skip TypeScript types on any function parameter or return value
- Use `any`
- Use `// eslint-disable` without a comment explaining the specific reason
- Create a file longer than 200 lines — split it
- Write a function longer than 30 lines without questioning whether it should be split
- Hardcode values that belong in constants or environment variables
- Duplicate logic that already exists elsewhere in the codebase — search first, write second

---

*These rules do not expire and do not bend to deadlines. If a rule feels like it conflicts with what is being asked — flag the conflict, do not silently violate the rule.*
