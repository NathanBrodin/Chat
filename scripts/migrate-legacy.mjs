/**
 * One-off import of the legacy Next.js chat data into the new schema.
 *
 * Source: TMP_DATABASE_URL (legacy Vercel Postgres, `chat_conversations` + `chat_messages`).
 * Target: DATABASE_URL (current Neon branch, `conversation`).
 *
 * Safe by default: prints a summary and exits. Pass --write to insert.
 * Re-running is idempotent because rows are upserted by conversation id.
 *
 * Usage:
 *   vpr exec varlock run -- node scripts/migrate-legacy.mjs
 *   vpr exec varlock run -- node scripts/migrate-legacy.mjs --write
 *   vpr exec varlock run -- node scripts/migrate-legacy.mjs --write --target-env PROD_DATABASE_URL
 */

// Timestamps are stored without a time zone on both sides. The legacy session
// runs in GMT, so parsing and serializing must happen in UTC to avoid shifting.
process.env.TZ = "UTC"

import postgres from "postgres"

const BATCH_SIZE = 50

const shouldWrite = process.argv.includes("--write")
const targetEnvIndex = process.argv.indexOf("--target-env")
const targetEnvName = targetEnvIndex === -1 ? "DATABASE_URL" : process.argv[targetEnvIndex + 1]

const sourceUrl = process.env.TMP_DATABASE_URL
const targetUrl = process.env[targetEnvName]

if (!sourceUrl || !targetUrl) {
  throw new Error(`TMP_DATABASE_URL and ${targetEnvName} must both be set`)
}
if (sourceUrl === targetUrl) {
  throw new Error("Source and target point at the same database")
}

const host = (url) => new URL(url).host

const source = postgres(sourceUrl, { max: 1 })
const target = postgres(targetUrl, { max: 1 })

function toNumber(value) {
  if (value === null || value === undefined) return null
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : null
}

/**
 * The legacy app inserted the user and assistant messages of a turn in a
 * single statement, so both rows share one `created_at`. Ordering by
 * `created_at` alone shuffles every transcript, hence the role tie-break.
 */
function orderMessages(rows) {
  return [...rows].sort((a, b) => {
    const byTime = a.created_at.getTime() - b.created_at.getTime()
    if (byTime !== 0) return byTime
    const byRole = (a.role === "user" ? 0 : 1) - (b.role === "user" ? 0 : 1)
    if (byRole !== 0) return byRole
    return 0
  })
}

/**
 * Collapse an exchange that is byte-identical to the one directly before it.
 * That pattern comes from retried saves. Repeated user questions with
 * different answers are real history and must survive.
 */
function collapseRepeatedExchanges(messages, removed) {
  const kept = []

  for (let index = 0; index < messages.length; ) {
    const current = messages[index]
    const next = messages[index + 1]
    const previousCurrent = kept[kept.length - 2]
    const previousNext = kept[kept.length - 1]

    const repeatsPreviousExchange =
      next &&
      previousCurrent &&
      previousNext &&
      current.role === previousCurrent.role &&
      next.role === previousNext.role &&
      current.content === previousCurrent.content &&
      next.content === previousNext.content

    if (repeatsPreviousExchange) {
      removed.count += 2
      index += 2
      continue
    }

    kept.push(current)
    index += 1
  }

  return kept
}

async function readLegacy() {
  const conversations = await source`
    select id, preview, created_at, city, country, region, latitude, longitude
    from chat_conversations
    order by created_at asc, id asc
  `

  const messages = await source`
    select conversation_id, id, role, content, created_at
    from chat_messages
    order by conversation_id, created_at,
      case when role = 'user' then 0 else 1 end, ctid asc
  `

  return { conversations, messages }
}

function buildPayload(legacy) {
  const messagesByConversation = new Map()
  for (const message of legacy.messages) {
    const list = messagesByConversation.get(message.conversation_id) ?? []
    list.push(message)
    messagesByConversation.set(message.conversation_id, list)
  }

  const stats = {
    droppedConversations: 0,
    droppedEmptyMessages: 0,
    collapsedMessages: 0,
  }
  const removed = { count: 0 }
  const rows = []

  for (const conversation of legacy.conversations) {
    const legacyMessages = orderMessages(messagesByConversation.get(conversation.id) ?? [])

    if (legacyMessages.length === 0) {
      stats.droppedConversations += 1
      continue
    }

    const withContent = legacyMessages.filter((message) => {
      if (message.content === "") {
        stats.droppedEmptyMessages += 1
        return false
      }
      return true
    })

    const deduped = collapseRepeatedExchanges(withContent, removed)
    stats.collapsedMessages = removed.count

    if (deduped.length === 0) {
      stats.droppedConversations += 1
      continue
    }

    const lastMessage = legacyMessages.at(-1)

    rows.push({
      id: conversation.id,
      title: conversation.preview.trim() || "New conversation",
      city: conversation.city,
      country: conversation.country,
      region: conversation.region,
      latitude: toNumber(conversation.latitude),
      longitude: toNumber(conversation.longitude),
      timezone: null,
      metadata: null,
      messages: deduped.map((message) => ({
        id: message.id,
        role: message.role,
        parts: [{ type: "text", text: message.content }],
      })),
      created_at: conversation.created_at,
      updated_at: lastMessage.created_at,
    })
  }

  return { rows, stats }
}

function printSummary(legacy, rows, stats) {
  const messageCount = rows.reduce((total, row) => total + row.messages.length, 0)

  console.log("Legacy → new chat migration")
  console.log(`  source: ${host(sourceUrl)}`)
  console.log(`  target: ${host(targetUrl)}`)
  console.log(`  mode:   ${shouldWrite ? "WRITE" : "dry run (pass --write to insert)"}`)
  console.log("")
  console.log(`  legacy conversations:   ${legacy.conversations.length}`)
  console.log(`  legacy messages:        ${legacy.messages.length}`)
  console.log(`  dropped conversations:  ${stats.droppedConversations} (no messages)`)
  console.log(`  dropped empty messages: ${stats.droppedEmptyMessages}`)
  console.log(`  collapsed retries:      ${stats.collapsedMessages}`)
  console.log(`  importing conversations:${String(rows.length).padStart(4)}`)
  console.log(`  importing messages:     ${messageCount}`)
  console.log("")

  for (const row of rows.slice(0, 3)) {
    console.log(`  · ${row.id}  ${row.title.slice(0, 50)}`)
    console.log(`    ${row.created_at.toISOString()}  ${row.messages.length} messages`)
    console.log(`    roles: ${row.messages.map((message) => message.role).join(", ")}`)
  }
}

async function assertTargetReady() {
  const [table] = await target`select to_regclass('public.conversation') as name`
  if (!table?.name) {
    throw new Error("Target has no `conversation` table. Run `vpr db migrate` first.")
  }

  const [existing] = await target`select count(*)::int as count from conversation`
  console.log(`  target already holds ${existing.count} conversations`)
  console.log("")
}

async function write(rows) {
  await target.begin(async (tx) => {
    await tx`set time zone 'UTC'`

    for (let index = 0; index < rows.length; index += BATCH_SIZE) {
      const batch = rows.slice(index, index + BATCH_SIZE).map((row) => ({
        ...row,
        messages: tx.json(row.messages),
      }))

      await tx`
        insert into conversation ${tx(batch)}
        on conflict (id) do update set
          title = excluded.title,
          city = excluded.city,
          country = excluded.country,
          region = excluded.region,
          latitude = excluded.latitude,
          longitude = excluded.longitude,
          timezone = excluded.timezone,
          metadata = excluded.metadata,
          messages = excluded.messages,
          created_at = excluded.created_at,
          updated_at = excluded.updated_at
      `

      process.stdout.write(`\r  written ${Math.min(index + BATCH_SIZE, rows.length)}/${rows.length}`)
    }

    process.stdout.write("\n")
  })
}

try {
  await source`set time zone 'UTC'`
  await target`set time zone 'UTC'`

  const legacy = await readLegacy()
  const { rows, stats } = buildPayload(legacy)

  await assertTargetReady()
  printSummary(legacy, rows, stats)

  if (shouldWrite) {
    await write(rows)
    console.log("\nDone.")
  } else {
    console.log("Dry run complete. Nothing was written.")
  }
} finally {
  await source.end()
  await target.end()
}
