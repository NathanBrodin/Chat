import { createFormHook, createFormHookContexts } from '@tanstack/react-form'

import { InputField } from './fields/input'
import { SubmitButton } from './submit'

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts()

export const { useAppForm } = createFormHook({
  fieldComponents: {
    InputField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
})
