import { AlertTriangle, Github, Globe, InfoIcon, User } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"

export default function InfoDialog() {
  return (
    <Dialog>
      <DialogTrigger className="hidden items-center gap-1 place-self-end text-xs text-muted-foreground sm:flex">
        <InfoIcon className="size-3" />
        Nathan&apos;s AI
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nathan&apos;s AI</DialogTitle>
          <DialogDescription>Welcome to my AI portfolio!</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Links</h3>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="https://github.com/nathanbrodin/chat"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="size-4" />
                Project Repo
              </Link>
              <Link
                href="https://brodin.dev"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe className="size-4" />
                Portfolio
              </Link>
              <Link
                href="https://github.com/nathanbrodin"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                target="_blank"
                rel="noopener noreferrer"
              >
                <User className="size-4" />
                GitHub Profile
              </Link>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Privacy Concerns</h3>
            <p className="text-sm text-muted-foreground">
              Please be aware that all conversations are saved and visible to anyone. (Don&apos;t ask crazy questions,
              we see you)
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">How Nathan&apos;s AI Knows About Me</h3>
            <p className="text-sm text-muted-foreground">
              I give to an AI model (Claude) context about my career and how it should answer your questions. I still
              noticed some hallucinations from the AI so don&apos;t trust everything it says.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/conversations" passHref>
              <Button variant="outline" className="w-full">
                <AlertTriangle className="mr-2 size-4 text-yellow-500" />
                Do not click on this
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
