import { APPLICATION_STATUSES, type Application, type ApplicationStatus } from '../types/application'

const STORAGE_KEY = 'application-tracker:applications'

const isApplication = (value: unknown): value is Application => {
  if (!value || typeof value !== 'object') return false
  const application = value as Record<string, unknown>
  return typeof application.id === 'string'
    && typeof application.company === 'string'
    && typeof application.position === 'string'
    && typeof application.applicationDate === 'string'
    && typeof application.notes === 'string'
    && APPLICATION_STATUSES.includes(application.status as ApplicationStatus)
}

export const loadApplications = (): Application[] => {
  try {
    const savedData = window.localStorage.getItem(STORAGE_KEY)
    if (!savedData) return []
    const parsedData: unknown = JSON.parse(savedData)
    return Array.isArray(parsedData) && parsedData.every(isApplication) ? parsedData : []
  } catch {
    return []
  }
}

export const saveApplications = (applications: Application[]): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
  } catch {
    // Storage may be unavailable or full; retain the in-memory application state.
  }
}
