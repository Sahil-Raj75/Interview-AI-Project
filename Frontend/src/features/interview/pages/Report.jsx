import { useMemo, useState } from 'react'
import '../styles/report.scss'
import { useInterview } from '../hooks/useInterview'


const sections = [
  { id: 'behaviour', label: 'Behaviour questions' },
  { id: 'technical', label: 'Technical Questions' },
  { id: 'roadmap', label: 'Roadmap' }
]

const Report = () => {
  const {report} = useInterview();

  const [activeSection, setActiveSection] = useState('technical')

  const sectionContent = useMemo(() => {
    if (activeSection === 'behaviour') {
      return report.behavioralQuestions.map((item, index) => (
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
      return report.technicalQuestions.map((item, index) => (
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
          {report.preparationPlan.map((item) => (
            <article className='roadmap-card' key={`plan-${item.day}`}>
              <div className='roadmap-card-top'>
                <span className='roadmap-day-label'>Day {item.day}</span>
              </div>
              <h3 className='roadmap-card-title'>{item.focus}</h3>
              <ul className='roadmap-tasks'>
                {item.tasks.map((task, taskIndex) => (
                  <li key={`task-${item.day}-${taskIndex}`}>{task}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )
    }

    return null
  }, [activeSection])

  const sectionSummary = useMemo(() => {
    if (activeSection === 'behaviour') {
      return `${report.behavioralQuestions.length} behaviour questions with story-driven insights.`
    }

    if (activeSection === 'technical') {
      return `${report.technicalQuestions.length} technical questions reviewing system design, algorithms, and performance.`
    }

    return 'A concise 5-day preparation plan with focused study tasks and mock interview practice.'
  }, [activeSection])

  const sectionCount = useMemo(() => {
    if (activeSection === 'behaviour') return report.behavioralQuestions.length
    if (activeSection === 'technical') return report.technicalQuestions.length
    return report.preparationPlan.length
  }, [activeSection])

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
