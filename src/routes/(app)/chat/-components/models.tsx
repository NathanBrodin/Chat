import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { AlertCircleIcon, CheckIcon } from 'lucide-react'
import { Fragment, useMemo, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'

import type { Model } from '@/lib/models/types'

import {
  ModelSelector,
  ModelSelectorCollection,
  ModelSelectorCommand,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorGroupLabel,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorName,
  ModelSelectorPanel,
  ModelSelectorPopup,
  ModelSelectorSeparator,
  ModelSelectorTrigger,
} from '@/components/ai-elements/model-selector'
import { Button } from '@/components/ui/button'
import { CommandFooter } from '@/components/ui/command'
import { getModels as getServerModels } from '@/lib/models/functions'

interface ModelGroup {
  value: string
  items: Model[]
}

/**
 * Extracts the model group from a string.
 * Returns the text before the first colon, or "Others" if no colon exists.
 */
const getModelGroup = (name: string): string => {
  if (!name.includes(':')) {
    return 'Others'
  }
  return name.split(':')[0].trim()
}

/**
 * Extracts the model name from a string.
 * Returns the text after the first colon, or the original string if no colon exists.
 */
const getModelName = (name: string): string => {
  if (!name.includes(':')) {
    return name.trim()
  }
  // Split by first colon and take everything after it
  return name.substring(name.indexOf(':') + 1).trim()
}

function groupModels(models: Model[]): ModelGroup[] {
  const map = new Map<string, Model[]>()

  for (const model of models) {
    const groupName = getModelGroup(model.name)
    const existing = map.get(groupName)
    if (existing) {
      existing.push(model)
    } else {
      map.set(groupName, [model])
    }
  }

  return Array.from(map.entries()).map(([value, items]) => ({ value, items }))
}

export function ChatModels() {
  const [model, setModel] = useLocalStorage<string | null>(
    'selected-model',
    'z-ai/glm-4.5-air:free',
  )
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false)
  const [highlightedItem, setHighlightedItem] = useState<Model | undefined>()

  const getModels = useServerFn(getServerModels)
  const { data, error, isLoading } = useQuery({
    queryKey: ['models'],
    queryFn: () => getModels(),
    retry: false,
  })

  const modelGroups = useMemo<ModelGroup[]>(() => (data ? groupModels(data) : []), [data])

  const selectedModelData = useMemo(
    () => modelGroups.flatMap((g) => g.items).find((m) => m.id === model),
    [modelGroups, model],
  )

  function handleItemClick(item: Model) {
    setModel(item.id)
    setModelSelectorOpen(false)
  }

  return (
    <ModelSelector onOpenChange={setModelSelectorOpen} open={modelSelectorOpen}>
      <ModelSelectorTrigger render={<Button variant="outline" />}>
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="size-4 animate-pulse rounded-full bg-current opacity-30" />
            <span className="h-3 w-24 animate-pulse rounded bg-current opacity-20" />
          </span>
        ) : selectedModelData ? (
          <>
            <ModelSelectorLogo provider={selectedModelData.id?.split('/')[0]} />
            <ModelSelectorName>{getModelName(selectedModelData.name)}</ModelSelectorName>
          </>
        ) : (
          <ModelSelectorName>Select a model</ModelSelectorName>
        )}
      </ModelSelectorTrigger>
      <ModelSelectorPopup>
        <ModelSelectorCommand
          items={modelGroups}
          onItemHighlighted={(highlightedValue) => {
            setHighlightedItem(highlightedValue as Model | undefined)
          }}
        >
          <ModelSelectorInput placeholder="Search models..." />
          <ModelSelectorPanel>
            {error ? (
              <div className="flex items-center gap-2 px-3 py-4 text-sm text-destructive">
                <AlertCircleIcon className="size-4 shrink-0" />
                <span>Failed to load models: {error.message}</span>
              </div>
            ) : (
              <>
                <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
                <ModelSelectorList>
                  {(group: ModelGroup, index: number) => (
                    <Fragment key={group.value}>
                      {index > 0 && <ModelSelectorSeparator />}
                      <ModelSelectorGroup items={group.items}>
                        <ModelSelectorGroupLabel>{group.value}</ModelSelectorGroupLabel>
                        <ModelSelectorCollection>
                          {(item: Model) => (
                            <ModelSelectorItem
                              key={item.id}
                              onClick={() => handleItemClick(item)}
                              value={item.id}
                            >
                              <ModelSelectorLogo provider={item.id?.split('/')[0]} />
                              <ModelSelectorName>{getModelName(item.name)}</ModelSelectorName>
                              {model === item.id ? (
                                <CheckIcon className="ml-auto size-4 shrink-0" />
                              ) : (
                                <div className="ml-auto size-4 shrink-0" />
                              )}
                            </ModelSelectorItem>
                          )}
                        </ModelSelectorCollection>
                      </ModelSelectorGroup>
                    </Fragment>
                  )}
                </ModelSelectorList>
              </>
            )}
          </ModelSelectorPanel>
          <CommandFooter>
            <p className="line-clamp-2">{highlightedItem?.description}</p>
          </CommandFooter>
        </ModelSelectorCommand>
      </ModelSelectorPopup>
    </ModelSelector>
  )
}
