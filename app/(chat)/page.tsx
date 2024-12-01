import { generateId } from "ai"
import Chat from "@/components/chat"
import InfoDialog from "@/components/info-dialog"
import { AI } from "@/lib/chat/actions"
import { getQuestions } from "@/lib/questions/actions"
import { searchParamsToGeo } from "@/lib/utils"

// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const dynamic = "force-dynamic"
export const maxDuration = 30

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Home(props: PageProps) {
  const searchParams = await props.searchParams
  const location = searchParamsToGeo(searchParams)
  const questions = await getQuestions(location)

  return (
    <main className="relative flex h-[100dvh] w-screen bg-background text-foreground">
      <AI initialAIState={{ messages: [], id: generateId(), location }}>
        <Chat location={location} questions={questions} />
      </AI>
      <div className="absolute left-0 top-0 z-20 m-4 flex sm:hidden">
        <InfoDialog />
      </div>
    </main>
  )
}
