import { createFormHook, createFormHookContexts } from '@tanstack/react-form'

import { EmailField, InputField, PasswordField } from './fields/input'
import { SubmitButton } from './submit'

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts()

export const { useAppForm } = createFormHook({
  fieldComponents: {
    InputField,
    EmailField,
    PasswordField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
})
