import { useStore } from '@tanstack/react-form'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Tooltip, TooltipPopup, TooltipTrigger } from '@/components/ui/tooltip'

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

export function EmailField({
  label = 'Email',
  placeholder = 'john@example.com',
}: {
  label?: string
  placeholder?: string
}) {
  const field = useFieldContext<string>()

  const meta = useStore(field.store, (state) => state.meta)
  const hasErrors = meta.isTouched && meta.errors.length > 0

  return (
    <Field name={field.name}>
      <FieldLabel>{label}</FieldLabel>
      <Input
        aria-invalid={hasErrors || undefined}
        autoComplete="email"
        placeholder={placeholder}
        type="email"
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
      />
      <FieldError />
    </Field>
  )
}

export function PasswordField({
  label = 'Password',
  placeholder = 'Enter your password',
  newPassword,
}: {
  label?: string
  placeholder?: string
  newPassword?: boolean
}) {
  const [showPassword, setShowPassword] = useState(false)
  const field = useFieldContext<string>()

  const meta = useStore(field.store, (state) => state.meta)
  const hasErrors = meta.isTouched && meta.errors.length > 0

  return (
    <Field name={field.name}>
      <FieldLabel>{label}</FieldLabel>
      <InputGroup>
        <InputGroupInput
          autoComplete={newPassword ? 'new-password' : 'current-password'}
          placeholder={placeholder}
          type={showPassword ? 'text' : 'password'}
          aria-invalid={hasErrors || undefined}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
        />
        <InputGroupAddon align="inline-end">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                  size="icon-xs"
                  variant="ghost"
                />
              }
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </TooltipTrigger>
            <TooltipPopup>{showPassword ? 'Hide password' : 'Show password'}</TooltipPopup>
          </Tooltip>
        </InputGroupAddon>
      </InputGroup>
      <FieldError />
    </Field>
  )
}
