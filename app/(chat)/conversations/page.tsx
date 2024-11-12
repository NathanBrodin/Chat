import { getConversations } from "@/lib/db/actions"
import { columns } from "./colums"
import { DataTable } from "./data-table"

export default async function ConversationsPage() {
  const conversationList = await getConversations()

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">What Are You Doing Here, You Curious One?</h2>
          <p className="text-muted-foreground">
            Couldn’t resist? Explore what others have been asking Nathan&apos;s AI!
          </p>
        </div>
      </div>
      <DataTable columns={columns} data={conversationList} />
    </div>
  )
}
