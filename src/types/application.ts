export const APPLICATION_STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected'] as const
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]
export interface Application { id: string; company: string; position: string; applicationDate: string; status: ApplicationStatus; notes: string }
