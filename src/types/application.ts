export const APPLICATION_STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected'] as const
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]
export const APPLICATION_PRIORITIES = ['High', 'Medium', 'Low'] as const
export type ApplicationPriority = (typeof APPLICATION_PRIORITIES)[number]
export interface Interview { id: string; interviewDate: string; round: string; notes: string }
export interface Application { id: string; company: string; position: string; applicationDate: string; deadline?: string; interviews?: Interview[]; priority?: ApplicationPriority; status: ApplicationStatus; notes: string }
