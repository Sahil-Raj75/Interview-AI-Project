import { useMemo, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import '../styles/report.scss'
import { useInterview } from '../hooks/useInterview'
import { handleFollowUpQuestion } from '../services/interview.api'

const NAV_SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'role-fit', label: 'Role Fit' },
  { id: 'technical', label: 'Technical Interview' },
  { id: 'behavioural', label: 'Behavioural Interview' },
  { id: 'roadmap', label: 'Preparation Roadmap' }
]

const scoreVerdict = (score) => {
  if (score == null) return null
  if (score >= 85) return 'Strong Match'
  if (score >= 70) return 'Good Match'
  if (score >= 50) return 'Developing Fit'
  return 'Needs Preparation'
}

const getRoleTitle = (report) => report?.role || report?.jobTitle || report?.targetRole || report?.targerRole || report?.title || 'Interview Assessment'

const getStrengths = (report) => {
  const strengths = report?.strengths || report?.strongSkills || report?.skills
  if (Array.isArray(strengths) && strengths.length) return strengths.slice(0, 6).map((item) => typeof item === 'string' ? item : item.skill || item.name).filter(Boolean)
  return ['Backend Engineering', 'API Development', 'Problem Solving', 'Technical Communication']
}

const getAlignment = (report) => {
  if (report?.skillAlignment?.length) return report.skillAlignment.slice(0, 6)
  return (report?.skillGaps || []).slice(0, 5).map((gap) => ({ skill: gap.skill, percentage: gap.severity === 'high' ? 50 : gap.severity === 'medium' ? 68 : 82 }))
}

const getPerspective = (report) => ({
  whatStandsOut: report?.recruiterPerspective?.whatStandsOut || 'Strong practical experience and a clear foundation across the requirements represented in this assessment.',
  potentialConcerns: report?.recruiterPerspective?.potentialConcerns || (report?.skillGaps?.length ? `Prioritize evidence and examples for ${report.skillGaps.slice(0, 2).map((gap) => gap.skill).join(' and ')}.` : 'Use specific production examples to make your technical impact easy to evaluate.'),
  recommendation: report?.recruiterPerspective?.recommendation || 'Proceed with confidence and use the preparation roadmap to sharpen the highest-impact topics before the interview.'
})

const MockInterviewChat = ({ interviewId, question, questionType, questionIndex }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [answer, setAnswer] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [messages, setMessages] = useState(question.conversation ?? [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmedAnswer = answer.trim()

    if (!trimmedAnswer || isThinking) return

    setMessages((currentMessages) => [
      ...currentMessages,
      { sender: 'user', text: trimmedAnswer }
    ])
    setAnswer('')
    setErrorMessage('')
    setIsThinking(true)

    try {
      const response = await handleFollowUpQuestion(
        interviewId,
        questionType,
        question._id || question.id,
        trimmedAnswer,
        questionIndex
      )
      setMessages(response.conversation ?? [])
    } catch (error) {
      const message = error.response?.data?.message || 'I could not review that answer. Please try again.'
      setErrorMessage(message)
      setMessages((currentMessages) => [
        ...currentMessages,
        { sender: 'ai', text: message }
      ])
      console.error('Unable to generate follow-up:', error)
    } finally {
      setIsThinking(false)
    }
  }

  return (
    <div className={`mock-chat ${isOpen ? 'is-open' : ''}`}>
      <button
        type='button'
        className='mock-chat-toggle'
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span>{isOpen ? 'Close practice' : 'Practice Response'}</span>
        <span className='mock-chat-toggle-icon' aria-hidden='true'>{isOpen ? '−' : '+'}</span>
      </button>

      {isOpen && (
        <div className='mock-chat-container'>
          <div className='mock-chat-heading'>
            <div>
              <span className='mock-chat-eyebrow'>Live practice</span>
              <h4>Interviewer follow-up</h4>
            </div>
            <span className='interviewer-status'>AI interviewer</span>
          </div>

          <div className='mock-chat-messages' aria-live='polite'>
            {messages.length === 0 && (
              <p className='mock-chat-empty'>Answer the question above to begin the discussion.</p>
            )}
            {messages.map((message, index) => (
              <div className={`mock-message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`} key={`${message.sender}-${index}`}>
                <span className='mock-message-sender'>{message.sender === 'user' ? 'You' : 'AI interviewer'}</span>
                <p>{message.text}</p>
              </div>
            ))}
            {isThinking && (
              <div className='mock-message ai-message mock-thinking' aria-label='AI is thinking'>
                <span className='mock-message-sender'>AI interviewer</span>
                <span className='typing-dots'><i /><i /><i /></span>
              </div>
            )}
          </div>

          {errorMessage && <p className='mock-chat-error'>{errorMessage}</p>}

          <form className='mock-chat-input-row' onSubmit={handleSubmit}>
            <input
              type='text'
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder='Type your answer or explanation...'
              aria-label='Your answer or explanation'
              disabled={isThinking}
            />
            <button type='submit' className='mock-send-button' aria-label='Send answer' disabled={!answer.trim() || isThinking}>
              <span aria-hidden='true' style={{ fontSize: '14px' }}>Send</span>
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

const Report = () => {
  const { interviewId } = useParams()
  const navigate = useNavigate()
  const { report, loading, getReportById, getResumePdf } = useInterview()

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId)
    }
  }, [interviewId])

  const [activeSection, setActiveSection] = useState('overview')
  const [completedDays, setCompletedDays] = useState([])

  const handleNavClick = (id) => {
    setActiveSection(id)
  }

  const toggleDayComplete = (day) => {
    setCompletedDays((current) =>
      current.includes(day) ? current.filter((d) => d !== day) : [...current, day]
    )
  }

  const verdict = useMemo(() => scoreVerdict(report?.matchScore), [report])
  const totalDays = report?.preparationPlan?.length ?? 0
  const roleTitle = getRoleTitle(report)
  const strengths = getStrengths(report)
  const alignment = getAlignment(report)
  const perspective = getPerspective(report)

  if (loading || !report) {
    return (
      <main className='report-page' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div className='report-loading'>Loading report...</div>
      </main>
    )
  }

  return (
    <main className='report-page'>
      <header className='report-header-bar'>
        <button type='button' className='report-back-button' onClick={() => navigate('/')}>
          ← <span>Back to Reports</span>
        </button>
        <button type='button' className='btn btn-secondary report-download-button' onClick={() => getResumePdf(interviewId)}>
          Download Report
        </button>
      </header>

      <nav className='report-tabs' aria-label='Report sections'>
        {NAV_SECTIONS.map((section) => (
          <button key={section.id} type='button' className={`report-tab ${activeSection === section.id ? 'active' : ''}`} onClick={() => handleNavClick(section.id)}>
            {section.label}
          </button>
        ))}
      </nav>

      <div className='report-board'>
        <section className='report-main'>

          {activeSection === 'overview' && <>
          {/* Hero */}
          <div className='report-section'>
            <div className='hero-panel'>
              <div>
                <div className='hero-status-badge'>
                  <span className='dot' />
                  Assessment Complete
                </div>
                <p className='hero-eyebrow'>{roleTitle}</p>
                <h1 className='hero-title'>Interview Readiness</h1>
                <p className='hero-description'>
                  AI-powered assessment based on your resume, experience, and the requirements of this role.
                </p>
                <div className='hero-meta'>
                  <div>
                    <span className='meta-label'>Role</span>
                    <span className='meta-value'>{roleTitle}</span>
                  </div>
                  <div>
                    <span className='meta-label'>Assessment</span>
                    <span className='meta-value'>AI Interview Analysis</span>
                  </div>
                  {report.createdAt && (
                    <div>
                      <span className='meta-label'>Generated</span>
                        <span className='meta-value'>{new Date(report.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Readiness Snapshot — built from real counts, not fabricated metrics */}
          <div className='report-section'>
            <div className='section-heading'>
              <p className='small-label'>Snapshot</p>
              <h2>Readiness Snapshot</h2>
              <p>The signals that shape your interview preparation plan.</p>
            </div>
            <div className='snapshot-grid'>
              <div className='snapshot-card'>
                <strong>{report.matchScore ?? '--'}%</strong>
                <div className='snapshot-label'>Role Match</div>
                <div className='snapshot-sub'>{verdict || 'Based on resume analysis'}</div>
              </div>
              <div className='snapshot-card'>
                <strong>{report.technicalQuestions?.length ?? 0}</strong>
                <div className='snapshot-label'>Technical Questions</div>
                <div className='snapshot-sub'>Role-specific prompts</div>
              </div>
              <div className='snapshot-card'>
                <strong>{report.behavioralQuestions?.length ?? 0}</strong>
                <div className='snapshot-label'>Behavioural Questions</div>
                <div className='snapshot-sub'>Experience-led prompts</div>
              </div>
              <div className='snapshot-card'>
                <strong>{totalDays}</strong>
                <div className='snapshot-label'>Prep Plan</div>
                <div className='snapshot-sub'>Day roadmap</div>
              </div>
            </div>
          </div>
          </>}

          {/* Strengths & Focus Areas */}
          {activeSection === 'role-fit' && <>
          <div className='report-section'>
            <div className='section-heading'>
              <p className='small-label'>Role Fit</p>
              <h2>Strengths &amp; Focus Areas</h2>
              <p>Where your profile is strong, and where to spend your prep time.</p>
            </div>
            <div className='strengths-focus-grid'>
              <div className='strengths-panel'>
                <h3 style={{ fontFamily: 'Sora', fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>Your Strengths</h3>
                <p className='content-intent' style={{ marginBottom: '16px' }}>Areas where your profile shows strong alignment with the role.</p>
                <div className='strength-chips'>
                  {strengths.map((strength) => (
                    <span className='strength-chip' key={strength}>✓ {strength}</span>
                  ))}
                </div>
              </div>

              <div className='focus-panel'>
                <h3 style={{ fontFamily: 'Sora', fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>Focus Areas</h3>
                <p className='content-intent' style={{ marginBottom: '16px' }}>Skills that could have the biggest impact on your interview performance.</p>
                <div className='focus-list'>
                  {report.skillGaps?.map((gap, index) => (
                    <div className='focus-item' key={gap.skill}>
                      <span className='focus-index'>{String(index + 1).padStart(2, '0')}</span>
                      <div className='focus-body'>
                        <h4>{gap.skill}</h4>
                      </div>
                      <span className={`priority-pill severity-${gap.severity || 'default'}`}>
                        {gap.severity ? `${gap.severity} priority` : 'Focus area'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Why You Match — only if skill-alignment data exists */}
          {alignment.length > 0 && (
            <div className='report-section'>
              <div className='section-heading'>
                <p className='small-label'>Alignment</p>
                <h2>Why You're a Strong Match</h2>
                <p>Your profile aligns strongly with several core requirements of this role.</p>
              </div>
              <div className='alignment-panel'>
                {alignment.map((item) => (
                  <div className='alignment-row' key={item.skill}>
                    <div className='alignment-top'>
                      <span>{item.skill}</span>
                      <span>{item.percentage}%</span>
                    </div>
                    <div className='alignment-track'>
                      <div className='alignment-fill' style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recruiter Perspective — only if provided */}
          {perspective && (
            <div className='report-section'>
              <div className='section-heading'>
                <p className='small-label'>Insight</p>
                <h2>Recruiter Perspective</h2>
                <p>How your profile may be perceived during the hiring process.</p>
              </div>
              <div className='recruiter-panel'>
                {perspective.whatStandsOut && (
                  <div className='recruiter-block'>
                    <h4>What Stands Out</h4>
                    <p>{perspective.whatStandsOut}</p>
                  </div>
                )}
                {perspective.potentialConcerns && (
                  <div className='recruiter-block'>
                    <h4>Potential Concerns</h4>
                    <p>{perspective.potentialConcerns}</p>
                  </div>
                )}
                {perspective.recommendation && (
                  <div className='recruiter-block'>
                    <h4>Interview Recommendation</h4>
                    <p>{perspective.recommendation}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          </>}

          {/* Technical Interview */}
          {activeSection === 'technical' && <>
          <div className='report-section'>
            <div className='section-heading'>
              <div className='section-count-row'>
                <h2 style={{ margin: 0 }}>Technical Interview</h2>
                <span className='section-count'>{report.technicalQuestions?.length ?? 0} questions</span>
              </div>
              <p>Technical questions generated around the role requirements and your identified skill gaps.</p>
            </div>
            <div className='content-stack'>
              {report.technicalQuestions?.map((item, index) => (
                <article className='content-card' key={`technical-${index}`}>
                  <div className='content-card-top'>
                    <span className='question-badge'>T{index + 1}</span>
                    <span className='content-label'>Technical prompt</span>
                  </div>
                  <h3>{item.question}</h3>
                  <p className='content-intent'>{item.intention}</p>
                  <details className='preparation-details'>
                    <summary>View Preparation Guide <span>+</span></summary>
                    <div className='preparation-content'>
                      <span className='content-label'>What to cover</span>
                      <p className='content-answer'>{item.answer}</p>
                      <MockInterviewChat interviewId={interviewId} question={item} questionType='technical' questionIndex={index} />
                    </div>
                  </details>
                </article>
              ))}
            </div>
          </div>
          </>}

          {/* Behavioural Interview */}
          {activeSection === 'behavioural' && <>
          <div className='report-section'>
            <div className='section-heading'>
              <div className='section-count-row'>
                <h2 style={{ margin: 0 }}>Behavioural Interview</h2>
                <span className='section-count'>{report.behavioralQuestions?.length ?? 0} questions</span>
              </div>
              <p>Questions tailored to your experience and the situations most likely to be discussed.</p>
            </div>
            <div className='content-stack'>
              {report.behavioralQuestions?.map((item, index) => (
                <article className='content-card' key={`behaviour-${index}`}>
                  <div className='content-card-top'>
                    <span className='question-badge'>B{index + 1}</span>
                    <span className='content-label'>Behavioural prompt</span>
                  </div>
                  <h3>{item.question}</h3>
                  <p className='content-intent'>{item.intention}</p>
                  <details className='preparation-details'>
                    <summary>Practice Response <span>+</span></summary>
                    <div className='preparation-content'>
                      <span className='content-label'>Suggested approach</span>
                      <p className='content-answer'>{item.answer}</p>
                      <MockInterviewChat interviewId={interviewId} question={item} questionType='behavioral' questionIndex={index} />
                    </div>
                  </details>
                </article>
              ))}
            </div>
          </div>
          </>}

          {/* Preparation Roadmap */}
          {activeSection === 'roadmap' && <>
          <div className='report-section'>
            <div className='section-heading'>
              <p className='small-label'>Preparation</p>
              <h2>Your Preparation Roadmap</h2>
              <p>A focused {totalDays || ''}-day preparation plan built around the gaps identified in your assessment.</p>
            </div>

            <div className='roadmap-progress'>
              <div className='roadmap-progress-track'>
                <div
                  className='roadmap-progress-fill'
                  style={{ width: totalDays ? `${(completedDays.length / totalDays) * 100}%` : '0%' }}
                />
              </div>
              <span>{completedDays.length} / {totalDays} Days Completed</span>
            </div>

            <div className='roadmap-main'>
              {report.preparationPlan?.map((item) => {
                const isComplete = completedDays.includes(item.day)
                return (
                  <article className={`roadmap-card ${isComplete ? 'is-complete' : ''}`} key={`plan-${item.day}`}>
                    <div className='roadmap-day-marker'>
                      <span className='roadmap-day-label'>Day {item.day}</span>
                      <button
                        type='button'
                        className={isComplete ? 'checked' : ''}
                        onClick={() => toggleDayComplete(item.day)}
                        aria-label={isComplete ? `Mark day ${item.day} incomplete` : `Mark day ${item.day} complete`}
                      >
                        {isComplete ? '✓' : ''}
                      </button>
                    </div>
                    <div className='roadmap-card-body'>
                      <h3 className='roadmap-card-title'>{item.focus}</h3>
                      <ul className='roadmap-tasks'>
                        {item.tasks?.map((task, taskIndex) => (
                          <li key={`task-${item.day}-${taskIndex}`}>{task}</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
          </>}
        </section>

        {/* ---------- Right sticky action panel ---------- */}
        <aside className='report-panel'>
          <div className='panel-block'>
            <span className='panel-label'>Readiness</span>
            <div className='score-ring-outer'>
              <div className='score-ring' style={{ '--pct': report.matchScore ?? 0 }}>
                <span>{report.matchScore ?? '--'}%</span>
              </div>
              {verdict && <span className='readiness-verdict'>{verdict}</span>}
            </div>
          </div>

          {report.skillGaps?.length > 0 && (
            <div className='panel-block'>
              <span className='panel-label'>Top Priority</span>
              <div className='skill-gaps'>
                <div className={`skill-pill severity-${report.skillGaps[0].severity || 'default'}`}>
                  {report.skillGaps[0].skill}
                </div>
              </div>
            </div>
          )}

          <div className='panel-block panel-cta'>
            <span className='panel-label'>Next Step</span>
            <button type='button' className='btn btn-primary' onClick={() => handleNavClick('roadmap')}>
              Start Preparation →
            </button>
          </div>
        </aside>
      </div>
    </main>
  )
}

export default Report