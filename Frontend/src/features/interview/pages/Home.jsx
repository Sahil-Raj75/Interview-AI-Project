import React, { useState } from 'react'
import '../styles/style.scss'
import { useInterview } from '../hooks/useInterview'
import { useNavigate } from 'react-router'

const Home = () => {
    const navigate = useNavigate()
    const { loading, reports, generateReport, getAllReports, handleLogout } = useInterview()
    const [activeView, setActiveView] = useState('dashboard')
    const [jobDescription, setjobDescription] = useState('')
    const [selfDescription, setselfDescription] = useState('')
    const [companyPrompt, setCompanyPrompt] = useState('')
    const [resumeFile, setResumeFile] = useState(null)
    const viewContent = {
        dashboard: {
            title: 'Report Generator',
            description:
                'Analyze candidate fit by comparing specific job requirements with professional backgrounds.'
        },

        reports: {
            title: 'My reports',
            description:
                'Review the reports you have already generated for your interview preparation.'
        },

        jobMatcher: {
            title: 'Job Matcher',
            description:
                'Find jobs that match your skills and professional background.'
        },

        savedProfiles: {
            title: 'Saved Profiles',
            description:
                'View and manage your saved candidate profiles.'
        },

        settings: {
            title: 'Settings',
            description:
                'Manage your application preferences and account settings.'
        }
    }

    const handleUserLogout = () => {
        // Clear any authentication tokens or user data here
        
        handleLogout();
        navigate('/login') // Redirect to login page after logout
    }
    const handleGenerateReport = async () => {
        if (!resumeFile) {
            alert('Please choose a file')
            return
        }

        const response = await generateReport({ resumeFile, jobDescription, selfDescription, companyPrompt })
        const reportId = response?._id

        if (reportId) {
            navigate(`/interview/${reportId}`)
        } else {
            console.error('Could not read report ID from response', response)
        }
    }

    const handleOpenDashboard = () => {
        setActiveView('dashboard')
    }

    const handleOpenReports = async () => {
        setActiveView('reports')
        await getAllReports()
    }

    const renderDashboardView = () => (
        <div className='report-layout'>
            <section className='panel left-panel'>
                <div className='panel-title'>
                    <span>JOB DESCRIPTION</span>
                </div>
                <textarea
                    onChange={(e) => { setjobDescription(e.target.value) }}
                    name='jobDescription'
                    id='jobDescription'
                    placeholder='Paste the full job description here, including responsibilities, technical requirements, and soft skills...'
                    rows={14}
                    value={jobDescription}
                />
            </section>

            <section className='panel right-panel'>
                <div className='file-card'>
                    <p className='panel-label'>RESUME</p>
                    <div className='file-drop'>
                        <div className='file-icon'>📄</div>
                        <div>
                            <strong>Upload Resume</strong>
                            <p>PDF, DOCX (Max 10MB)</p>
                            <label className='browse-button' htmlFor='resume'>Browse Files</label>
                        </div>
                    </div>
                    <input
                        type='file'
                        id='resume'
                        accept='.pdf,.doc,.docx'
                        onChange={(e) => {
                            setResumeFile(e.target.files[0])
                        }}
                    />
                </div>

                <div className='panel-group'>
                    <label htmlFor='companyPrompt' className='panel-label'>TARGET COMPANY &amp; CULTURE ALIGNMENT</label>
                    <textarea
                        onChange={(e) => { setCompanyPrompt(e.target.value) }}
                        name='companyPrompt'
                        id='companyPrompt'
                        placeholder='e.g., I am targeting Stripe because of their event-driven payment scale...'
                        rows={5}
                        value={companyPrompt}
                    />

                    <label htmlFor='selfDescription' className='panel-label'>SELF DESCRIPTION</label>
                    <textarea
                        onChange={(e) => { setselfDescription(e.target.value) }}
                        name='selfDescription'
                        id='selfDescription'
                        placeholder="Add notes about the candidate's personality, interview performance, or specific cultural fit observations..."
                        rows={6}
                        value={selfDescription}
                    />
                    <button type='button' onClick={handleGenerateReport} className='button'>Generate the report</button>
                </div>

                <p className='hint'>*AI-driven analysis typically takes 10-15 seconds.</p>
            </section>
        </div>
    )

    const renderReportsView = () => (
        <div className='report-layout reports-layout'>
            <section className='panel reports-panel'>
                <div className='reports-list-shell'>
                    <div className='reports-toolbar'>
                        <div>
                            <h2>Your reports</h2>
                            <p>Open any report you already generated and continue reviewing it.</p>
                        </div>
                        <button type='button' onClick={handleOpenDashboard} className='button'>Back to generator</button>
                    </div>

                    {loading ? (
                        <div className='empty-state'>
                            <h3>Loading your reports...</h3>
                        </div>
                    ) : reports?.length ? (
                        <div className='reports-grid'>
                            {reports.map((reportItem) => (
                                <button
                                    type='button'
                                    key={reportItem._id}
                                    className='report-card'
                                    onClick={() => navigate(`/interview/${reportItem._id}`)}
                                >
                                    <span className='report-card-title'>
                                        {reportItem.title || 'Interview report'}
                                    </span>
                                    <p>{reportItem.jobDescription?.slice(0, 140) || 'Open this report to see the full analysis.'}</p>
                                    <div className='report-meta'>
                                        <span>{reportItem.createdAt ? new Date(reportItem.createdAt).toLocaleDateString() : 'Recent'}</span>
                                        <span>{reportItem.matchScore ? `${reportItem.matchScore}% match` : 'View details'}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className='empty-state'>
                            <h3>No reports yet</h3>
                            <p>Create your first report from the dashboard to see it appear here.</p>
                            <button type='button' onClick={handleOpenDashboard} className='button'>Generate your first report</button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )

    if (loading && activeView === 'dashboard') {
        return (
            <main className='loading'>
                <h1>Interview report loading....</h1>
            </main>
        )
    }

    return (
        <main className='home'>
            <section className='report-generator-shell'>
                <aside className='side-nav'>
                    <nav>
                        <button type='button' className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`} onClick={handleOpenDashboard}>Dashboard</button>
                        <button type='button' className={`nav-item ${activeView === 'reports' ? 'active' : ''}`} onClick={handleOpenReports}>Reports</button>
                        <button type='button' className='nav-item'>Job Matcher</button>
                        <button type='button' className='nav-item'>Saved Profiles</button>
                        <button type='button' className='nav-item'>Settings</button>
                    </nav>
                </aside>

                <div className='report-content'>
                    <header className='report-header'>
                        <div>
                            <h1>{viewContent[activeView].title}</h1>
                            <p>{viewContent[activeView].description}</p>
                        </div>
                        <div >
                        <button type='button' className='button' onClick={handleUserLogout}>Logout</button>
                        </div>
                    </header>

                    {activeView === 'reports' ? renderReportsView() : activeView === 'dashboard' ? renderDashboardView() : null}
                </div>
            </section>
        </main>
    )
}

export default Home