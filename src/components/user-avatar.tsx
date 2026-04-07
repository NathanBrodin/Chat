import type { UserIdentity } from 'convex/server'

import { cn } from '@/lib/utils'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export function UserAvatar({ user, className }: { user: UserIdentity; className?: string }) {
  const name = user.name || user.nickname || user.email || '?'

  const initials = name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)

  return (
    <Avatar className={cn('h-8 w-8 rounded-lg', className)}>
      <AvatarImage src={user.pictureUrl} alt={user.name} />
      <AvatarFallback className="rounded-lg">{initials || '??'}</AvatarFallback>
    </Avatar>
  )
}
