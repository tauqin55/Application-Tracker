import type { ApplicationPriority } from '../types/application'
interface PriorityBadgeProps { priority?: ApplicationPriority }
export function PriorityBadge({ priority = 'Medium' }: PriorityBadgeProps) { return <span className={`priority priority-${priority.toLowerCase()}`}>{priority}</span> }
