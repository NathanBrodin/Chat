import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { AlertCircleIcon, CheckIcon } from 'lucide-react'
import { Fragment, useMemo, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'

import type { Model } from '@/lib/models/functions'

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
import { getModels as getServerModels } from '@/lib/models/functions'

interface ModelGroup {
  value: string
  items: Model[]
}

function groupModels(models: Model[]): ModelGroup[] {
  const map = new Map<string, Model[]>()

  for (const model of models) {
    const groupName = model.name.split(':')[0] ?? 'Other'
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

  const getModels = useServerFn(getServerModels)
  const { data, error, isLoading } = useQuery({
    queryKey: ['models'],
    queryFn: () => getModels(),
    retry: false,
  })

  const modelGroups = useMemo<ModelGroup[]>(
    () => (data?.data ? groupModels(data.data) : []),
    [data],
  )

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
            <ModelSelectorName>{selectedModelData.name.split(':')[1]}</ModelSelectorName>
          </>
        ) : (
          <ModelSelectorName>Select a model</ModelSelectorName>
        )}
      </ModelSelectorTrigger>
      <ModelSelectorPopup>
        <ModelSelectorCommand items={modelGroups}>
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
                              <ModelSelectorName>{item.name.split(':')[1]}</ModelSelectorName>
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
        </ModelSelectorCommand>
      </ModelSelectorPopup>
    </ModelSelector>
  )
}
