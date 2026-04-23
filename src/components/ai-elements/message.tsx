import type { UIMessage } from 'ai'
import type { ComponentProps, HTMLAttributes, ReactElement } from 'react'

import { cjk } from '@streamdown/cjk'
import { code } from '@streamdown/code'
import { math } from '@streamdown/math'
import { mermaid } from '@streamdown/mermaid'
import { ChevronLeftIcon, ChevronRightIcon, DownloadIcon, TextIcon, SheetIcon } from 'lucide-react'
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  extractTableDataFromElement,
  Streamdown,
  tableDataToCSV,
  tableDataToMarkdown,
} from 'streamdown'

import { CopyButton } from '@/components/copy-button/copy-button'
import { Button } from '@/components/ui/button'
import { ButtonGroup, ButtonGroupText } from '@/components/ui/button-group'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '@/components/ui/menu'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

import { Frame } from '../ui/frame'

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  from: UIMessage['role']
}

export const Message = ({ className, from, ...props }: MessageProps) => (
  <div
    className={cn(
      'group flex w-full max-w-[95%] flex-col gap-2',
      from === 'user' ? 'is-user ml-auto justify-end' : 'is-assistant',
      className,
    )}
    {...props}
  />
)

export type MessageContentProps = HTMLAttributes<HTMLDivElement>

export const MessageContent = ({ children, className, ...props }: MessageContentProps) => (
  <div
    className={cn(
      'is-user:dark flex w-fit min-w-0 max-w-full flex-col gap-2 overflow-hidden text-sm',
      'group-[.is-user]:ml-auto group-[.is-user]:rounded-lg group-[.is-user]:bg-secondary group-[.is-user]:px-4 group-[.is-user]:py-3 group-[.is-user]:text-foreground',
      'group-[.is-assistant]:text-foreground',
      className,
    )}
    {...props}
  >
    {children}
  </div>
)

export type MessageActionsProps = ComponentProps<'div'>

export const MessageActions = ({ className, children, ...props }: MessageActionsProps) => (
  <div className={cn('flex items-center gap-1', className)} {...props}>
    {children}
  </div>
)

export type MessageActionProps = ComponentProps<typeof Button> & {
  tooltip?: string
  label?: string
}

export const MessageAction = ({
  tooltip,
  children,
  label,
  variant = 'ghost',
  size = 'icon-sm',
  ...props
}: MessageActionProps) => {
  const button = (
    <Button size={size} type="button" variant={variant} {...props}>
      {children}
      <span className="sr-only">{label || tooltip}</span>
    </Button>
  )

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger render={button} />
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return button
}

interface MessageBranchContextType {
  currentBranch: number
  totalBranches: number
  goToPrevious: () => void
  goToNext: () => void
  branches: ReactElement[]
  setBranches: (branches: ReactElement[]) => void
}

const MessageBranchContext = createContext<MessageBranchContextType | null>(null)

const useMessageBranch = () => {
  const context = useContext(MessageBranchContext)

  if (!context) {
    throw new Error('MessageBranch components must be used within MessageBranch')
  }

  return context
}

export type MessageBranchProps = HTMLAttributes<HTMLDivElement> & {
  defaultBranch?: number
  onBranchChange?: (branchIndex: number) => void
}

export const MessageBranch = ({
  defaultBranch = 0,
  onBranchChange,
  className,
  ...props
}: MessageBranchProps) => {
  const [currentBranch, setCurrentBranch] = useState(defaultBranch)
  const [branches, setBranches] = useState<ReactElement[]>([])

  const handleBranchChange = useCallback(
    (newBranch: number) => {
      setCurrentBranch(newBranch)
      onBranchChange?.(newBranch)
    },
    [onBranchChange],
  )

  const goToPrevious = useCallback(() => {
    const newBranch = currentBranch > 0 ? currentBranch - 1 : branches.length - 1
    handleBranchChange(newBranch)
  }, [currentBranch, branches.length, handleBranchChange])

  const goToNext = useCallback(() => {
    const newBranch = currentBranch < branches.length - 1 ? currentBranch + 1 : 0
    handleBranchChange(newBranch)
  }, [currentBranch, branches.length, handleBranchChange])

  const contextValue = useMemo<MessageBranchContextType>(
    () => ({
      branches,
      currentBranch,
      goToNext,
      goToPrevious,
      setBranches,
      totalBranches: branches.length,
    }),
    [branches, currentBranch, goToNext, goToPrevious],
  )

  return (
    <MessageBranchContext.Provider value={contextValue}>
      <div className={cn('grid w-full gap-2 [&>div]:pb-0', className)} {...props} />
    </MessageBranchContext.Provider>
  )
}

export type MessageBranchContentProps = HTMLAttributes<HTMLDivElement>

export const MessageBranchContent = ({ children, ...props }: MessageBranchContentProps) => {
  const { currentBranch, setBranches, branches } = useMessageBranch()
  const childrenArray = useMemo(() => (Array.isArray(children) ? children : [children]), [children])

  // Use useEffect to update branches when they change
  useEffect(() => {
    if (branches.length !== childrenArray.length) {
      setBranches(childrenArray)
    }
  }, [childrenArray, branches, setBranches])

  return childrenArray.map((branch, index) => (
    <div
      className={cn(
        'grid gap-2 overflow-hidden [&>div]:pb-0',
        index === currentBranch ? 'block' : 'hidden',
      )}
      key={branch.key}
      {...props}
    >
      {branch}
    </div>
  ))
}

export type MessageBranchSelectorProps = ComponentProps<typeof ButtonGroup>

export const MessageBranchSelector = ({ className, ...props }: MessageBranchSelectorProps) => {
  const { totalBranches } = useMessageBranch()

  // Don't render if there's only one branch
  if (totalBranches <= 1) {
    return null
  }

  return (
    <ButtonGroup
      className={cn(
        '[&>*:not(:first-child)]:rounded-l-md [&>*:not(:last-child)]:rounded-r-md',
        className,
      )}
      orientation="horizontal"
      {...props}
    />
  )
}

export type MessageBranchPreviousProps = ComponentProps<typeof Button>

export const MessageBranchPrevious = ({ children, ...props }: MessageBranchPreviousProps) => {
  const { goToPrevious, totalBranches } = useMessageBranch()

  return (
    <Button
      aria-label="Previous branch"
      disabled={totalBranches <= 1}
      onClick={goToPrevious}
      size="icon-sm"
      type="button"
      variant="ghost"
      {...props}
    >
      {children ?? <ChevronLeftIcon size={14} />}
    </Button>
  )
}

export type MessageBranchNextProps = ComponentProps<typeof Button>

export const MessageBranchNext = ({ children, ...props }: MessageBranchNextProps) => {
  const { goToNext, totalBranches } = useMessageBranch()

  return (
    <Button
      aria-label="Next branch"
      disabled={totalBranches <= 1}
      onClick={goToNext}
      size="icon-sm"
      type="button"
      variant="ghost"
      {...props}
    >
      {children ?? <ChevronRightIcon size={14} />}
    </Button>
  )
}

export type MessageBranchPageProps = HTMLAttributes<HTMLSpanElement>

export const MessageBranchPage = ({ className, ...props }: MessageBranchPageProps) => {
  const { currentBranch, totalBranches } = useMessageBranch()

  return (
    <ButtonGroupText
      className={cn('border-none bg-transparent text-muted-foreground shadow-none', className)}
      {...props}
    >
      {currentBranch + 1} of {totalBranches}
    </ButtonGroupText>
  )
}

export type MessageResponseProps = ComponentProps<typeof Streamdown>

const streamdownPlugins = { cjk, code, math, mermaid }
const messageResponseStreamdownClassName = 'message-response-streamdown'

const downloadText = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

const getTableMarkdown = (table: HTMLTableElement | null): string => {
  if (!table) {
    return ''
  }

  return tableDataToMarkdown(extractTableDataFromElement(table))
}

type StreamdownTableProps = ComponentProps<'table'> & { node?: unknown }
type StreamdownTableSectionProps = ComponentProps<'thead'> & { node?: unknown }
type StreamdownTableBodyProps = ComponentProps<'tbody'> & { node?: unknown }
type StreamdownTableRowProps = ComponentProps<'tr'> & { node?: unknown }
type StreamdownTableHeadProps = ComponentProps<'th'> & { node?: unknown }
type StreamdownTableCellProps = ComponentProps<'td'> & { node?: unknown }
type StreamdownTableCaptionProps = ComponentProps<'caption'> & { node?: unknown }

const getDownloadPayload = (
  table: HTMLTableElement | null,
  format: 'csv' | 'markdown',
): { filename: string; mimeType: string; content: string } | null => {
  if (!table) {
    return null
  }

  const data = extractTableDataFromElement(table)

  if (format === 'csv') {
    return {
      content: tableDataToCSV(data),
      filename: 'table.csv',
      mimeType: 'text/csv',
    }
  }

  return {
    content: tableDataToMarkdown(data),
    filename: 'table.md',
    mimeType: 'text/markdown',
  }
}

const MessageResponseTable = ({
  children,
  className,
  node: _node,
  ...props
}: StreamdownTableProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null)

  const getMarkdown = useCallback(() => {
    const table = wrapperRef.current?.querySelector('table') as HTMLTableElement | null

    return getTableMarkdown(table)
  }, [])

  const handleDownload = useCallback((format: 'csv' | 'markdown') => {
    const table = wrapperRef.current?.querySelector('table') as HTMLTableElement | null
    const payload = getDownloadPayload(table, format)

    if (!payload) {
      return
    }

    downloadText(payload.content, payload.filename, payload.mimeType)
  }, [])

  return (
    <Frame data-streamdown="table-wrapper" ref={wrapperRef}>
      <Table variant="card" className={cn('relative', className)} {...props}>
        <div
          className="absolute top-0 right-0 z-10 flex items-center gap-1 rounded-md rounded-tr-2xl border bg-background/90 p-1 text-muted-foreground shadow-sm supports-[backdrop-filter]:bg-background/70 supports-[backdrop-filter]:backdrop-blur"
          data-message-streamdown-table-actions=""
        >
          <CopyButton
            aria-label="Copy table as Markdown"
            className="text-muted-foreground hover:text-foreground"
            size="icon-xs"
            text={getMarkdown}
            variant="ghost"
          />
          <Menu>
            <MenuTrigger
              render={
                <Button
                  aria-label="Download table"
                  className="rounded-tr-xl text-muted-foreground hover:text-foreground"
                  size="icon-xs"
                  variant="ghost"
                >
                  <DownloadIcon />
                </Button>
              }
            />
            <MenuPopup align="end" sideOffset={6}>
              <MenuItem onClick={() => handleDownload('markdown')}>
                <TextIcon />
                Download Markdown
              </MenuItem>
              <MenuItem onClick={() => handleDownload('csv')}>
                <SheetIcon />
                Download CSV
              </MenuItem>
            </MenuPopup>
          </Menu>
        </div>
        {children}
      </Table>
    </Frame>
  )
}

const MessageResponseTableHeader = ({ node: _node, ...props }: StreamdownTableSectionProps) => (
  <TableHeader {...props} />
)

const MessageResponseTableBody = ({ node: _node, ...props }: StreamdownTableBodyProps) => (
  <TableBody {...props} />
)

const MessageResponseTableRow = ({ node: _node, ...props }: StreamdownTableRowProps) => (
  <TableRow {...props} />
)

const MessageResponseTableHead = ({ node: _node, ...props }: StreamdownTableHeadProps) => (
  <TableHead {...props} />
)

const MessageResponseTableCell = ({ node: _node, ...props }: StreamdownTableCellProps) => (
  <TableCell {...props} />
)

const MessageResponseTableCaption = ({ node: _node, ...props }: StreamdownTableCaptionProps) => (
  <TableCaption {...props} />
)

const messageResponseComponents: NonNullable<MessageResponseProps['components']> = {
  caption: MessageResponseTableCaption,
  table: MessageResponseTable,
  tbody: MessageResponseTableBody,
  td: MessageResponseTableCell,
  th: MessageResponseTableHead,
  thead: MessageResponseTableHeader,
  tr: MessageResponseTableRow,
}

export const MessageResponse = memo(
  ({ className, components, ...props }: MessageResponseProps) => (
    <Streamdown
      className={cn(
        'size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
        messageResponseStreamdownClassName,
        className,
      )}
      components={{ ...messageResponseComponents, ...components }}
      plugins={streamdownPlugins}
      linkSafety={{ enabled: false }}
      {...props}
    />
  ),
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children && nextProps.isAnimating === prevProps.isAnimating,
)

MessageResponse.displayName = 'MessageResponse'

export type MessageToolbarProps = ComponentProps<'div'>

export const MessageToolbar = ({ className, children, ...props }: MessageToolbarProps) => (
  <div className={cn('mt-4 flex w-full items-center justify-between gap-4', className)} {...props}>
    {children}
  </div>
)
