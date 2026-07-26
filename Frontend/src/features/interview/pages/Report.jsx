import { useMemo, useState, useEffect } from 'react'
import { useParams } from 'react-router'
import '../styles/report.scss'
import { useInterview } from '../hooks/useInterview'


const sections = [
  { id: 'behaviour', label: 'Behaviour questions' },
  { id: 'technical', label: 'Technical Questions' },
  { id: 'roadmap', label: 'Roadmap' }
]

const Report = () => {
  const { interviewId } = useParams()
  const { report, loading, getReportById } = useInterview()
  
  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId)
    }
  }, [interviewId])

  const [activeSection, setActiveSection] = useState('behaviour')

  const sectionContent = useMemo(() => {
    
    
    if (loading || !report) {
      return <div className="report-loading">Loading report...</div>
    }

    if (activeSection === 'behaviour') {
      return report.behavioralQuestions?.map((item, index) => (

        <article className='content-card' key={`behaviour-${index}`}>
          <div className='content-card-top'>
            <span className='question-badge'>B{index + 1}</span>
            <span className='content-label'>Question</span>
          </div>
          <h3>{item.question}</h3>
          <p className='content-intent'>{item.intention}</p>
          <p className='content-answer'>{item.answer}</p>
        </article>
      ))
    }

    if (activeSection === 'technical') {
      return report.technicalQuestions?.map((item, index) => (
        <article className='content-card' key={`technical-${index}`}>
          <div className='content-card-top'>
            <span className='question-badge'>Q{index + 1}</span>
            <span className='content-label'>Question</span>
          </div>
          <h3>{item.question}</h3>
          <p className='content-intent'>{item.intention}</p>
          <p className='content-answer'>{item.answer}</p>
        </article>
      ))
    }

    if (activeSection === 'roadmap') {
      return (
        <div className='roadmap-main'>
          {report.preparationPlan?.map((item) => (
            <article className='roadmap-card' key={`plan-${item.day}`}>
              <div className='roadmap-card-top'>
                <span className='roadmap-day-label'>Day {item.day}</span>
              </div>
              <h3 className='roadmap-card-title'>{item.focus}</h3>
              <ul className='roadmap-tasks'>
                {item.tasks?.map((task, taskIndex) => (
                  <li key={`task-${item.day}-${taskIndex}`}>{task}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )
    }

    return null
  }, [activeSection,report])

  const sectionSummary = useMemo(() => {
    if (!report) return ''

    if (activeSection === 'behaviour') {
      return `${report.behavioralQuestions?.length ?? 0} behaviour questions with story-driven insights.`
    }

    if (activeSection === 'technical') {
      return `${report.technicalQuestions?.length ?? 0} technical questions reviewing system design, algorithms, and performance.`
    }

    return 'A concise 5-day preparation plan with focused study tasks and mock interview practice.'
  }, [activeSection, report])

  const sectionCount = useMemo(() => {
    if (!report) return 0
    if (activeSection === 'behaviour') return report.behavioralQuestions?.length ?? 0
    if (activeSection === 'technical') return report.technicalQuestions?.length ?? 0
    return report.preparationPlan?.length ?? 0
  }, [activeSection, report])

  if (loading || !report) {
    return (
      <main className='report-page'>
        <div className='report-board'>
          <div className='report-loading'>Loading report...</div>
        </div>
      </main>
    )
  }

  return (
    <main className='report-page'>
      <div className='report-board'>
        <aside className='report-side'>
          <div className='report-side-title'>sections</div>
          <nav className='report-sections'>
            {sections.map((section) => (
              <button
                key={section.id}
                className={`report-tab ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </aside>

        <section className='report-main'>
          <header className='report-main-header'>
            <div>
              <p className='small-label'>Interview report</p>
              <h1>Candidate readiness overview</h1>
              <p className='main-description'>Use the section selector to explore strengths, improvement areas, and the recommended preparation roadmap for this candidate.</p>
            </div>
          </header>

          <div className='report-content-shell'>
            <div className='content-header'>
              <div>
                <div className='content-header-top'>
                  <h2>{sections.find((item) => item.id === activeSection).label}</h2>
                  <span className='section-count'>{sectionCount} questions</span>
                </div>
                <p>{sectionSummary}</p>
              </div>
            </div>
            <div className='content-stack'>{sectionContent}</div>
          </div>
        </section>

        <aside className='report-panel'>
          <div className='panel-block'>
            <span className='panel-label'>Match score</span>
            <div className='score-ring'>
              <span>{report.matchScore}</span>
              <span><small>%</small></span>
            </div>
          </div>

          <div className='panel-block'>
            <span className='panel-label'>Skill gaps</span>
            <div className='skill-gaps'>
              {report.skillGaps.map((gap) => (
                <div key={gap.skill} className={`skill-pill severity-${gap.severity}`}>
                  {gap.skill}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}

export default Report
