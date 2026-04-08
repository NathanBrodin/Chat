import { useStore } from '@tanstack/react-form'

import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

import { useFieldContext } from '../use-form'

interface InputFieldProps {
  autoComplete?: string
  label: string
  placeholder?: string
  required?: boolean
  type?: React.HTMLInputTypeAttribute
}

export function InputField({
  autoComplete,
  label,
  placeholder,
  type,
  required = true,
}: InputFieldProps) {
  const field = useFieldContext<string>()

  const meta = useStore(field.store, (state) => state.meta)
  const hasErrors = meta.isTouched && meta.errors.length > 0

  return (
    <Field name={field.name}>
      <FieldLabel>{label}</FieldLabel>
      <Input
        aria-invalid={hasErrors || undefined}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        type={type}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
      />
      <FieldError />
    </Field>
  )
}
