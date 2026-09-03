import React, { useState } from 'react'
import '../styles/style.scss'
import { useInterview } from '../hooks/useInterview'
import { useNavigate } from 'react-router'

// ---- inline icons (no external icon library assumed) ----
const IconDashboard = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>
)
const IconReports = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 21V9M10 21V3M17 21v-6"/></svg>
)
const IconJobMatcher = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3M11 8v6M8 11h6"/></svg>
)
const IconSaved = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 3h12v18l-6-4-6 4z"/></svg>
)
const IconSettings = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
)
const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
)
const IconLogout = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
)
const IconBell = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
)
const IconHelp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 2-3 4"/><path d="M12 17h.01"/></svg>
)
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>
)
const IconDoc = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>
)
const IconBuilding = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1"/></svg>
)
const IconSparkle = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 l1.9 6.1 L20 10 l-6.1 1.9 L12 18 l-1.9-6.1 L4 10 l6.1-1.9z"/></svg>
)
const IconUploadCloud = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 16.5A4.5 4.5 0 0 1 8.5 12h.5a5 5 0 0 1 9.9-1H19a3.5 3.5 0 0 1 0 7H7a3 3 0 0 1-3-3.5z"/><path d="M12 12v6M9.5 15.5 12 13l2.5 2.5"/></svg>
)
const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
)

const toList = (value) => {
    if (Array.isArray(value)) {
        return value.map((item) => typeof item === 'string' ? item : item?.skill || item?.name || item?.label).filter(Boolean)
    }
    return typeof value === 'string' ? value.split(/[,•|]/).map((item) => item.trim()).filter(Boolean) : []
}

const getReportSummary = (reportItem) => {
    const rawTitle = reportItem.title || reportItem.roleTitle || reportItem.targetRole || reportItem.targerRole || 'Interview report'
    const titleParts = rawTitle.match(/^(.+?)\s*\((.+)\)$/)
    const roleTitle = reportItem.roleTitle || reportItem.targetRole || reportItem.targerRole || titleParts?.[1] || rawTitle
    const specialization = reportItem.specialization || reportItem.roleContext || reportItem.jobSpecialization || titleParts?.[2] || 'Role analysis'
    const score = Number.isFinite(Number(reportItem.matchScore)) ? Number(reportItem.matchScore) : null
    const strengths = toList(reportItem.strengths || reportItem.strongSkills || reportItem.skills).slice(0, 3)
    const focusAreas = toList(reportItem.focusAreas || reportItem.skillGaps || reportItem.gaps).slice(0, 3)

    return {
        roleTitle,
        specialization,
        score,
        strengths: strengths.length ? strengths : ['See profile analysis'],
        focusAreas: focusAreas.length ? focusAreas : ['No focus areas listed'],
        matchLabel: score === null ? 'Match pending' : score >= 85 ? 'Strong Match' : score >= 70 ? 'Good Match' : score >= 50 ? 'Developing Fit' : 'Needs Preparation',
        date: reportItem.createdAt ? new Date(reportItem.createdAt) : null,
        searchText: [roleTitle, specialization, ...strengths, ...focusAreas].join(' ').toLowerCase()
    }
}

const formatGeneratedDate = (date) => date && !Number.isNaN(date.getTime())
    ? `Generated ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    : 'Generated recently'

const Home = () => {
    const navigate = useNavigate()
    const { loading, reports, generateReport, getAllReports, handleLogout } = useInterview()
    const [activeView, setActiveView] = useState('dashboard')
    const [jobDescription, setjobDescription] = useState('')
    const [selfDescription, setselfDescription] = useState('')
    const [companyPrompt, setCompanyPrompt] = useState('')
    const [resumeFile, setResumeFile] = useState(null)
    const [reportSearch, setReportSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('All Roles')
    const [reportSort, setReportSort] = useState('recent')
    const viewContent = {
        dashboard: {
            title: 'Generate Interview Intelligence',
            description:
                'Analyze your fit, identify skill gaps, and prepare for the interview with AI-powered insights.'
        },

        reports: {
            title: 'Interview Reports',
            description:
                'Review your personalized role analysis, interview insights, and preparation plans.'
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

    const handleRemoveResumeFile = () => {
        setResumeFile(null)
    }

    const reportSummaries = (reports || []).map((reportItem) => ({ reportItem, summary: getReportSummary(reportItem) }))
    const roleOptions = ['All Roles', ...new Set(reportSummaries.map(({ summary }) => summary.roleTitle))]
    const visibleReports = reportSummaries
        .filter(({ summary }) => summary.searchText.includes(reportSearch.trim().toLowerCase()))
        .filter(({ summary }) => roleFilter === 'All Roles' || summary.roleTitle === roleFilter)
        .sort((first, second) => {
            if (reportSort === 'oldest') return (first.summary.date?.getTime() || 0) - (second.summary.date?.getTime() || 0)
            if (reportSort === 'highest') return (second.summary.score || 0) - (first.summary.score || 0)
            if (reportSort === 'lowest') return (first.summary.score || 0) - (second.summary.score || 0)
            return (second.summary.date?.getTime() || 0) - (first.summary.date?.getTime() || 0)
        })

    const renderDashboardView = () => (
        <div className='report-layout'>
            <section className='left-panel'>
                <div className='panel'>
                    <div className='panel-title'>
                        <IconDoc />
                        <span>Job Description</span>
                    </div>
                    <textarea
                        onChange={(e) => { setjobDescription(e.target.value) }}
                        name='jobDescription'
                        id='jobDescription'
                        placeholder='Paste the job description to identify the skills, responsibilities, and expectations that matter most...'
                        rows={14}
                        value={jobDescription}
                    />
                </div>

                <div className='panel'>
                    <div className='panel-title'>
                        <IconBuilding />
                        <span>Target Company &amp; Culture Alignment</span>
                    </div>
                    <textarea
                        onChange={(e) => { setCompanyPrompt(e.target.value) }}
                        name='companyPrompt'
                        id='companyPrompt'
                        placeholder='Add the company name, role, or culture notes to make the recommendations more specific.'
                        rows={6}
                        value={companyPrompt}
                    />
                </div>
            </section>

            <section className='right-panel'>
                <div className='panel'>
                    <div className='panel-title'>
                        <IconUser />
                        <span>Candidate Context</span>
                    </div>
                    <textarea
                        onChange={(e) => { setselfDescription(e.target.value) }}
                        name='selfDescription'
                        id='selfDescription'
                        placeholder="Add relevant experience, achievements, interview notes, or anything you'd like the analysis to consider..."
                        rows={6}
                        value={selfDescription}
                    />
                </div>

                <div className='file-card'>
                    <div className='file-card-header'>
                        <div className='panel-title-inline'>
                            <IconDoc />
                            <span>Resume</span>
                        </div>
                        <div className='ai-chip'>
                            <IconSparkle />
                            AI Parsing Ready
                        </div>
                    </div>

                    <div className='file-drop'>
                        <div className='file-icon'>
                            <IconUploadCloud />
                        </div>
                        <strong>Upload Resume</strong>
                        <p>PDF, DOCX (Max 10MB)</p>
                        <label className='browse-button' htmlFor='resume'>Browse Files</label>
                        <input
                            type='file'
                            id='resume'
                            accept='.pdf,.doc,.docx'
                            onChange={(e) => {
                                setResumeFile(e.target.files[0])
                            }}
                        />
                    </div>

                    {resumeFile && (
                        <div className='uploaded-file'>
                            <div className='uploaded-file-info'>
                                <IconDoc />
                                <span>{resumeFile.name}</span>
                            </div>
                            <button type='button' onClick={handleRemoveResumeFile} aria-label='Remove file'>
                                <IconClose />
                            </button>
                        </div>
                    )}

                    <div className='file-card-footer'>
                        <button type='button' onClick={handleGenerateReport} className='button'>Generate Interview Plan →</button>
                    </div>

                    <p className='hint'>*AI-driven analysis typically takes 10-15 seconds.</p>
                </div>
            </section>
        </div>
    )

    const renderReportsView = () => (
        <div className='report-layout reports-layout'>
            <section className='reports-panel'>
                <div className='reports-list-shell'>
                    <div className='reports-toolbar'>
                        <div>
                            <h2>My Reports</h2>
                            <p>Open any report you already generated and continue reviewing it.</p>
                        </div>
                        <button type='button' onClick={handleOpenDashboard} className='button'>Back to generator</button>
                    </div>

                    {loading ? (
                        <div className='empty-state'>
                            <h3>Loading your reports...</h3>
                        </div>
                    ) : reports?.length ? (
                        <>
                            <div className='reports-filters'>
                                <div className='reports-search'>
                                    <IconSearch />
                                    <input type='search' value={reportSearch} onChange={(event) => setReportSearch(event.target.value)} placeholder='Search reports...' aria-label='Search reports' />
                                </div>
                                <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} aria-label='Filter by role'>
                                    {roleOptions.map((role) => <option key={role}>{role}</option>)}
                                </select>
                                <select value={reportSort} onChange={(event) => setReportSort(event.target.value)} aria-label='Sort reports'>
                                    <option value='recent'>Sort: Recent</option>
                                    <option value='oldest'>Sort: Oldest</option>
                                    <option value='highest'>Sort: Highest Match</option>
                                    <option value='lowest'>Sort: Lowest Match</option>
                                </select>
                            </div>

                            {visibleReports.length ? <div className='reports-grid'>
                                {visibleReports.map(({ reportItem, summary }) => (
                                    <button type='button' key={reportItem._id} className='report-card' onClick={() => navigate(`/interview/${reportItem._id}`)}>
                                        <div className='report-card-heading'>
                                            <div className='report-card-identity'>
                                                <span className='report-card-kicker'>Role</span>
                                                <span className='report-card-title'>{summary.roleTitle}</span>
                                                <span className='report-card-context'>{summary.specialization}</span>
                                            </div>
                                            <div className='report-score'>
                                                <strong>{summary.score === null ? '--' : `${summary.score}%`}</strong>
                                                <span>Role Match</span>
                                            </div>
                                        </div>
                                        <span className='report-match-label'>{summary.matchLabel}</span>
                                        <div className='report-card-section'>
                                            <span>Strong in</span>
                                            <p>{summary.strengths.join(' • ')}</p>
                                        </div>
                                        <div className='report-card-section'>
                                            <span>Focus areas</span>
                                            <p>{summary.focusAreas.join(' • ')}</p>
                                        </div>
                                        <div className='report-meta'>
                                            <span>{formatGeneratedDate(summary.date)}</span>
                                            <span className='report-card-action'>View Report →</span>
                                        </div>
                                    </button>
                                ))}
                            </div> : <div className='empty-state filtered-empty-state'><h3>No matching reports</h3><p>Try a different search or role filter.</p></div>}
                        </>
                    ) : (
                        <div className='empty-state'>
                            <h3>No interview reports yet</h3>
                            <p>Generate your first report to analyze your role fit, identify skill gaps, and build a focused interview preparation plan.</p>
                            <button type='button' onClick={handleOpenDashboard} className='button'>Generate Your First Report →</button>
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
                    <div className='side-nav-brand'>
                        <div className='brand-mark'>
                            <IconSparkle />
                        </div>
                        <div>
                            <h1>PrepFlow</h1>
                            <p>Recruitment Suite</p>
                        </div>
                    </div>

                    <nav>
                        <button type='button' className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`} onClick={handleOpenDashboard}>
                            <IconDashboard /> Dashboard
                        </button>
                        <button type='button' className={`nav-item ${activeView === 'reports' ? 'active' : ''}`} onClick={handleOpenReports}>
                            <IconReports /> Reports
                        </button>
                        <button type='button' className='nav-item'>
                            <IconJobMatcher /> Job Matcher
                        </button>
                    </nav>

                    <div className='nav-group-bottom'>
                        <button type='button' className='nav-item'>
                            <IconSaved /> Saved Profiles
                        </button>
                        <button type='button' className='nav-item'>
                            <IconSettings /> Settings
                        </button>
                    </div>
                </aside>

                <header className='top-nav'>
                    <div className='search-bar'>
                        <IconSearch />
                        <input type='text' placeholder='Search...' aria-label='Search' />
                    </div>

                    <div className='top-nav-actions'>
                        <button type='button' className='icon-button' onClick={handleUserLogout} aria-label='Logout'>
                            <IconLogout />
                            <span className='label'>Logout</span>
                        </button>
                        <button type='button' className='icon-button' aria-label='Notifications'>
                            <IconBell />
                        </button>
                        <button type='button' className='icon-button' aria-label='Help'>
                            <IconHelp />
                        </button>
                        <div className='avatar'>
                            <IconUser />
                        </div>
                    </div>
                </header>

                <div className='report-content'>
                    <header className='report-header'>
                        <div>
                            <h1>{viewContent[activeView].title}</h1>
                            <p>{viewContent[activeView].description}</p>
                        </div>
                    </header>

                    {activeView === 'reports' ? renderReportsView() : activeView === 'dashboard' ? renderDashboardView() : null}
                </div>
            </section>
        </main>
    )
}

export default Home