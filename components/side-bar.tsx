import { PanelRight } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ThemeCustomizer } from "./theme/theme-customizer"

export function SideBar() {
  return (
    <Sheet>
      <SheetTrigger aria-label="Sidebar">
        <PanelRight className="size-5 text-muted-foreground" />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Nathan&apos;s AI</SheetTitle>
          <div className="text-sm text-muted-foreground">
            <ThemeCustomizer />
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
