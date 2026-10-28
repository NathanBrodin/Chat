# Database Conventions

## Typed Text over Native Enums

- Prefer PostgreSQL `text` columns with TypeScript string-union types over native database enums.
- Define reusable database value types in `src/lib/db/schema/types.ts` and apply them with Drizzle's `text().$type<Type>()`.
- Do not introduce `pgEnum` unless a concrete database-level requirement makes a native enum necessary. Document that requirement beside the schema when it occurs.
- Type-level constraints do not validate untrusted runtime values. Continue validating at system boundaries and use database checks where an invariant requires database enforcement.

```ts
export type ProductVisibility = "draft" | "public" | "unlisted" | "archived"

visibility: text().$type<ProductVisibility>().notNull().default("public")
```
