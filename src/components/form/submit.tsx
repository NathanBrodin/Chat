import { Button } from '../ui/button'
import { useFormContext } from './use-form'

interface SubmitButtonProps {
  label: string
  submittingLabel?: string
}

export function SubmitButton({ label, submittingLabel }: SubmitButtonProps) {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <Button disabled={!canSubmit || isSubmitting} loading={isSubmitting} type="submit">
          {isSubmitting ? (submittingLabel ?? label) : label}
        </Button>
      )}
    </form.Subscribe>
  )
}
