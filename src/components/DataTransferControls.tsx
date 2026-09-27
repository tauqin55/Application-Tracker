import { useRef, useState, type ChangeEvent } from 'react'
import { APPLICATION_STATUSES, type Application, type ApplicationStatus } from '../types/application'

interface DataTransferControlsProps { applications: Application[]; onImport: (applications: Application[]) => void }

const isApplication = (value: unknown): value is Application => {
  if (!value || typeof value !== 'object') return false
  const application = value as Record<string, unknown>
  return typeof application.id === 'string' && typeof application.company === 'string' && typeof application.position === 'string' && typeof application.applicationDate === 'string' && typeof application.notes === 'string' && APPLICATION_STATUSES.includes(application.status as ApplicationStatus)
}

export function DataTransferControls({ applications, onImport }: DataTransferControlsProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')
  const exportApplications = () => { const file = new Blob([JSON.stringify(applications, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(file); const link = document.createElement('a'); link.href = url; link.download = 'application-tracker.json'; link.click(); URL.revokeObjectURL(url) }
  const importApplications = async (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; event.target.value = ''; if (!file) return; try { const data: unknown = JSON.parse(await file.text()); if (!Array.isArray(data) || !data.every(isApplication)) throw new Error('invalid'); onImport(data); setError('') } catch { setError('The selected file is not a valid Application Tracker JSON export.') } }
  return <div className="data-transfer"><div className="transfer-buttons"><button className="secondary-button" type="button" onClick={exportApplications}>Export JSON</button><button className="secondary-button" type="button" onClick={() => inputRef.current?.click()}>Import JSON</button><input ref={inputRef} className="visually-hidden" type="file" accept="application/json,.json" onChange={importApplications} /></div>{error && <p className="import-error" role="alert">{error}</p>}</div>
}
