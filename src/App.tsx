import { useEffect, useMemo, useState } from 'react'
import { ApplicationFilters, type DateSortOrder } from './components/ApplicationFilters'
import { ApplicationForm } from './components/ApplicationForm'
import { InterviewForm } from './components/InterviewForm'
import { ApplicationsTable } from './components/ApplicationsTable'
import { ConfirmDialog } from './components/ConfirmDialog'
import { ApplicationStatistics } from './components/ApplicationStatistics'
import { DataTransferControls } from './components/DataTransferControls'
import { StatusSummary } from './components/StatusSummary'
import { APPLICATION_STATUSES, type Application, type ApplicationStatus, type Interview } from './types/application'
import { loadApplications, saveApplications } from './utils/applicationStorage'
import './App.css'
import './filters.css'
import './statistics.css'
import './deadline.css'
import './data-transfer.css'
import './interviews.css'

const blankApplication = (): Omit<Application, 'id'> => ({ company: '', position: '', applicationDate: new Date().toISOString().slice(0, 10), deadline: '', interviews: [], status: 'Applied', notes: '' })

function App() {
  const [applications, setApplications] = useState<Application[]>(loadApplications)
  const [editingApplication, setEditingApplication] = useState<Application | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [applicationToDelete, setApplicationToDelete] = useState<Application | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'All'>('All')
  const [dateSortOrder, setDateSortOrder] = useState<DateSortOrder>('newest')
  const [interviewEditor, setInterviewEditor] = useState<{ applicationId: string; interview: Interview | null } | null>(null)
  useEffect(() => { saveApplications(applications) }, [applications])
  const openNewForm = () => { setEditingApplication(null); setIsFormOpen(true) }
  const saveApplication = (details: Omit<Application, 'id'>) => { setApplications((current) => editingApplication ? current.map((application) => application.id === editingApplication.id ? { ...details, id: application.id } : application) : [...current, { ...details, id: crypto.randomUUID() }]); setIsFormOpen(false); setEditingApplication(null) }
  const updateStatus = (id: string, status: ApplicationStatus) => setApplications((current) => current.map((application) => application.id === id ? { ...application, status } : application))
  const saveInterview = (details: Omit<Interview, 'id'>) => { if (!interviewEditor) return; setApplications((current) => current.map((application) => { if (application.id !== interviewEditor.applicationId) return application; const interviews = application.interviews ?? []; return { ...application, interviews: interviewEditor.interview ? interviews.map((interview) => interview.id === interviewEditor.interview?.id ? { ...details, id: interview.id } : interview) : [...interviews, { ...details, id: crypto.randomUUID() }] } })); setInterviewEditor(null) }
  const deleteInterview = (applicationId: string, interviewId: string) => setApplications((current) => current.map((application) => application.id === applicationId ? { ...application, interviews: (application.interviews ?? []).filter((interview) => interview.id !== interviewId) } : application))
  const confirmDeletion = () => { if (applicationToDelete) setApplications((current) => current.filter((application) => application.id !== applicationToDelete.id)); setApplicationToDelete(null) }
  const statusCounts = APPLICATION_STATUSES.reduce((counts, status) => ({ ...counts, [status]: applications.filter((application) => application.status === status).length }), {} as Record<ApplicationStatus, number>)
  const filteredApplications = useMemo(() => { const query = searchTerm.trim().toLowerCase(); return applications.filter((application) => (!query || application.company.toLowerCase().includes(query) || application.position.toLowerCase().includes(query)) && (statusFilter === 'All' || application.status === statusFilter)).sort((a, b) => dateSortOrder === 'newest' ? b.applicationDate.localeCompare(a.applicationDate) : a.applicationDate.localeCompare(b.applicationDate)) }, [applications, dateSortOrder, searchTerm, statusFilter])
  const hasActiveFilters = Boolean(searchTerm) || statusFilter !== 'All' || dateSortOrder !== 'newest'
  const clearFilters = () => { setSearchTerm(''); setStatusFilter('All'); setDateSortOrder('newest') }

  return <main className="app-shell"><header className="page-header"><div><p className="eyebrow">CAREER DASHBOARD</p><h1>Application Tracker</h1><p className="subtitle">Keep every opportunity in one clear view.</p></div><div className="header-actions"><DataTransferControls applications={applications} onImport={setApplications} /><button className="primary-button" type="button" onClick={openNewForm}><span aria-hidden="true">+</span> Add application</button></div></header><ApplicationStatistics total={applications.length} counts={statusCounts} /><StatusSummary counts={statusCounts} /><section className="content-card" aria-labelledby="applications-heading"><div className="section-heading"><div><h2 id="applications-heading">Your applications</h2><p>{filteredApplications.length} of {applications.length} {applications.length === 1 ? 'application' : 'applications'} shown</p></div></div><ApplicationFilters searchTerm={searchTerm} statusFilter={statusFilter} dateSortOrder={dateSortOrder} hasActiveFilters={hasActiveFilters} onSearchChange={setSearchTerm} onStatusChange={setStatusFilter} onDateSortChange={setDateSortOrder} onClear={clearFilters} /><ApplicationsTable applications={filteredApplications} hasFilters={hasActiveFilters} onClearFilters={clearFilters} onEdit={(application) => { setEditingApplication(application); setIsFormOpen(true) }} onDelete={setApplicationToDelete} onStatusChange={updateStatus} onAddInterview={(applicationId) => setInterviewEditor({ applicationId, interview: null })} onEditInterview={(applicationId, interview) => setInterviewEditor({ applicationId, interview })} onDeleteInterview={deleteInterview} onAdd={openNewForm} /></section>{isFormOpen && <ApplicationForm application={editingApplication} initialValues={blankApplication()} onSave={saveApplication} onClose={() => { setIsFormOpen(false); setEditingApplication(null) }} />}{interviewEditor && <InterviewForm interview={interviewEditor.interview} onSave={saveInterview} onClose={() => setInterviewEditor(null)} />}{applicationToDelete && <ConfirmDialog application={applicationToDelete} onConfirm={confirmDeletion} onClose={() => setApplicationToDelete(null)} />}</main>
}
export default App
