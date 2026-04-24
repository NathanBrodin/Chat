import { api } from '@convex/_generated/api'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/(app)/pricing/')({
  component: RouteComponent,
})

function RouteComponent() {
  const subscriptions = useQuery(api.polar.getConfiguredProducts)
  const otherone = useQuery(api.polar.listAllSubscriptions)
  console.log(otherone)

  console.log(subscriptions?.max)

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for individuals and small projects.',
      price: '$0',
      period: '/month',
      features: [
        'Up to 3 integrations',
        '1,000 API calls/month',
        'Community support',
        'Basic analytics',
      ],
      cta: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Pro',
      description: 'For growing teams that need more power.',
      price: '$29',
      period: '/month',
      features: [
        'Unlimited integrations',
        '100,000 API calls/month',
        'Priority support',
        'Advanced analytics',
        'Custom webhooks',
        'Team collaboration',
      ],
      cta: 'Start Free Trial',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      description: 'For organizations with advanced needs.',
      price: 'Custom',
      period: '',
      features: [
        'Everything in Pro',
        'Unlimited API calls',
        'Dedicated support',
        'SLA guarantee',
        'Custom contracts',
        'On-premise option',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ]

  return (
    <main className=" flex min-h-svh w-full items-center justify-center">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="text-center">
          <h2 className="font-heading text-4xl font-medium text-balance">
            Simple, Transparent Pricing
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-balance text-muted-foreground">
            Choose the plan that fits your needs. All plans include a 14-day free trial.
          </p>
        </div>
        <div className="mt-12 grid gap-3 xl:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn('relative flex flex-col p-6 ', plan.highlighted && 'border-primary')}
            >
              <div>
                <h3 className="font-medium text-foreground">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
              </div>
              <div className="mt-6">
                <span className="font-heading text-4xl font-medium">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button variant={plan.highlighted ? 'default' : 'outline'} className="mt-8 w-full">
                {plan.cta}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
