export type ViewMode = 'list' | 'kanban'
interface ViewModeToggleProps { value: ViewMode; onChange: (view: ViewMode) => void }
export function ViewModeToggle({ value, onChange }: ViewModeToggleProps) { return <div className="view-mode-toggle" aria-label="Application view"><button className={value === 'list' ? 'active' : ''} type="button" onClick={() => onChange('list')}>List</button><button className={value === 'kanban' ? 'active' : ''} type="button" onClick={() => onChange('kanban')}>Kanban</button></div> }
