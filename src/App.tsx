import { useState } from 'react'
import { ApplicationForm } from './components/ApplicationForm'
import { ApplicationsTable } from './components/ApplicationsTable'
import { ConfirmDialog } from './components/ConfirmDialog'
import type { Application } from './types/application'
import './App.css'

const blankApplication = (): Omit<Application, 'id'> => ({ company: '', position: '', applicationDate: new Date().toISOString().slice(0, 10), status: 'Applied', notes: '' })

function App() {
  const [applications, setApplications] = useState<Application[]>([])
  const [editingApplication, setEditingApplication] = useState<Application | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [applicationToDelete, setApplicationToDelete] = useState<Application | null>(null)
  const openNewForm = () => { setEditingApplication(null); setIsFormOpen(true) }
  const saveApplication = (details: Omit<Application, 'id'>) => {
    setApplications((current) => editingApplication ? current.map((application) => application.id === editingApplication.id ? { ...details, id: application.id } : application) : [...current, { ...details, id: crypto.randomUUID() }])
    setIsFormOpen(false); setEditingApplication(null)
  }
  const confirmDeletion = () => { if (applicationToDelete) setApplications((current) => current.filter((application) => application.id !== applicationToDelete.id)); setApplicationToDelete(null) }
  return <main className="app-shell"><header className="page-header"><div><p className="eyebrow">CAREER DASHBOARD</p><h1>Application Tracker</h1><p className="subtitle">Keep every opportunity in one clear view.</p></div><button className="primary-button" type="button" onClick={openNewForm}><span aria-hidden="true">+</span> Add application</button></header><section className="content-card" aria-labelledby="applications-heading"><div className="section-heading"><div><h2 id="applications-heading">Your applications</h2><p>{applications.length} {applications.length === 1 ? 'application' : 'applications'} tracked</p></div></div><ApplicationsTable applications={applications} onEdit={(application) => { setEditingApplication(application); setIsFormOpen(true) }} onDelete={setApplicationToDelete} onAdd={openNewForm} /></section>{isFormOpen && <ApplicationForm application={editingApplication} initialValues={blankApplication()} onSave={saveApplication} onClose={() => { setIsFormOpen(false); setEditingApplication(null) }} />}{applicationToDelete && <ConfirmDialog application={applicationToDelete} onConfirm={confirmDeletion} onClose={() => setApplicationToDelete(null)} />}</main>
}
export default App
