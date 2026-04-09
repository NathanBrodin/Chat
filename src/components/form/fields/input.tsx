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

  return (
    <Field
      name={field.name}
      invalid={!field.state.meta.isValid}
      dirty={field.state.meta.isDirty}
      touched={field.state.meta.isTouched}
    >
      <FieldLabel>{label}</FieldLabel>
      <Input
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        type={type}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
      />
      <FieldError match={!field.state.meta.isValid}>
        {field.state.meta.errors[0]?.message}
      </FieldError>
    </Field>
  )
}

export function EmailField({
  label = 'Email',
  placeholder = 'john@example.com',
  required = true,
}: {
  label?: string
  placeholder?: string
  required?: boolean
}) {
  const field = useFieldContext<string>()

  return (
    <Field
      name={field.name}
      invalid={!field.state.meta.isValid}
      dirty={field.state.meta.isDirty}
      touched={field.state.meta.isTouched}
    >
      <FieldLabel>{label}</FieldLabel>
      <Input
        autoComplete="email"
        placeholder={placeholder}
        required={required}
        type="email"
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
      />
      <FieldError match={!field.state.meta.isValid}>
        {field.state.meta.errors[0]?.message}
      </FieldError>
    </Field>
  )
}

export function PasswordField({
  newPassword,
  label = 'Password',
  placeholder = 'Enter your password',
  required = true,
}: {
  label?: string
  placeholder?: string
  newPassword?: boolean
  required?: boolean
}) {
  const [showPassword, setShowPassword] = useState(false)
  const field = useFieldContext<string>()

  return (
    <Field
      name={field.name}
      invalid={!field.state.meta.isValid}
      dirty={field.state.meta.isDirty}
      touched={field.state.meta.isTouched}
    >
      <FieldLabel>{label}</FieldLabel>
      <InputGroup>
        <InputGroupInput
          autoComplete={newPassword ? 'new-password' : 'current-password'}
          placeholder={placeholder}
          required={required}
          type={showPassword ? 'text' : 'password'}
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
      <FieldError match={!field.state.meta.isValid}>
        {field.state.meta.errors[0]?.message}
      </FieldError>
    </Field>
  )
}
