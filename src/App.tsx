import { useEffect, useMemo, useState } from 'react'
import { ApplicationFilters, type DateSortOrder } from './components/ApplicationFilters'
import { ApplicationForm } from './components/ApplicationForm'
import { ApplicationsTable } from './components/ApplicationsTable'
import { ConfirmDialog } from './components/ConfirmDialog'
import { ApplicationStatistics } from './components/ApplicationStatistics'
import { StatusSummary } from './components/StatusSummary'
import { APPLICATION_STATUSES, type Application, type ApplicationStatus } from './types/application'
import { loadApplications, saveApplications } from './utils/applicationStorage'
import './App.css'
import './filters.css'
import './statistics.css'

const blankApplication = (): Omit<Application, 'id'> => ({ company: '', position: '', applicationDate: new Date().toISOString().slice(0, 10), status: 'Applied', notes: '' })

function App() {
  const [applications, setApplications] = useState<Application[]>(loadApplications)
  const [editingApplication, setEditingApplication] = useState<Application | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [applicationToDelete, setApplicationToDelete] = useState<Application | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'All'>('All')
  const [dateSortOrder, setDateSortOrder] = useState<DateSortOrder>('newest')
  useEffect(() => { saveApplications(applications) }, [applications])
  const openNewForm = () => { setEditingApplication(null); setIsFormOpen(true) }
  const saveApplication = (details: Omit<Application, 'id'>) => { setApplications((current) => editingApplication ? current.map((application) => application.id === editingApplication.id ? { ...details, id: application.id } : application) : [...current, { ...details, id: crypto.randomUUID() }]); setIsFormOpen(false); setEditingApplication(null) }
  const updateStatus = (id: string, status: ApplicationStatus) => setApplications((current) => current.map((application) => application.id === id ? { ...application, status } : application))
  const confirmDeletion = () => { if (applicationToDelete) setApplications((current) => current.filter((application) => application.id !== applicationToDelete.id)); setApplicationToDelete(null) }
  const statusCounts = APPLICATION_STATUSES.reduce((counts, status) => ({ ...counts, [status]: applications.filter((application) => application.status === status).length }), {} as Record<ApplicationStatus, number>)
  const filteredApplications = useMemo(() => { const query = searchTerm.trim().toLowerCase(); return applications.filter((application) => (!query || application.company.toLowerCase().includes(query) || application.position.toLowerCase().includes(query)) && (statusFilter === 'All' || application.status === statusFilter)).sort((a, b) => dateSortOrder === 'newest' ? b.applicationDate.localeCompare(a.applicationDate) : a.applicationDate.localeCompare(b.applicationDate)) }, [applications, dateSortOrder, searchTerm, statusFilter])
  const hasActiveFilters = Boolean(searchTerm) || statusFilter !== 'All' || dateSortOrder !== 'newest'
  const clearFilters = () => { setSearchTerm(''); setStatusFilter('All'); setDateSortOrder('newest') }

  return <main className="app-shell"><header className="page-header"><div><p className="eyebrow">CAREER DASHBOARD</p><h1>Application Tracker</h1><p className="subtitle">Keep every opportunity in one clear view.</p></div><button className="primary-button" type="button" onClick={openNewForm}><span aria-hidden="true">+</span> Add application</button></header><ApplicationStatistics total={applications.length} counts={statusCounts} /><StatusSummary counts={statusCounts} /><section className="content-card" aria-labelledby="applications-heading"><div className="section-heading"><div><h2 id="applications-heading">Your applications</h2><p>{filteredApplications.length} of {applications.length} {applications.length === 1 ? 'application' : 'applications'} shown</p></div></div><ApplicationFilters searchTerm={searchTerm} statusFilter={statusFilter} dateSortOrder={dateSortOrder} hasActiveFilters={hasActiveFilters} onSearchChange={setSearchTerm} onStatusChange={setStatusFilter} onDateSortChange={setDateSortOrder} onClear={clearFilters} /><ApplicationsTable applications={filteredApplications} hasFilters={hasActiveFilters} onClearFilters={clearFilters} onEdit={(application) => { setEditingApplication(application); setIsFormOpen(true) }} onDelete={setApplicationToDelete} onStatusChange={updateStatus} onAdd={openNewForm} /></section>{isFormOpen && <ApplicationForm application={editingApplication} initialValues={blankApplication()} onSave={saveApplication} onClose={() => { setIsFormOpen(false); setEditingApplication(null) }} />}{applicationToDelete && <ConfirmDialog application={applicationToDelete} onConfirm={confirmDeletion} onClose={() => setApplicationToDelete(null)} />}</main>
}
export default App
