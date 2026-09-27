export const APPLICATION_STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected'] as const
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]
export interface Interview { id: string; interviewDate: string; round: string; notes: string }
export interface Application { id: string; company: string; position: string; applicationDate: string; deadline?: string; interviews?: Interview[]; status: ApplicationStatus; notes: string }
