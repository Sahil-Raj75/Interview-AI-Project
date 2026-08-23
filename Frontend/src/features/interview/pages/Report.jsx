import { useMemo, useState, useEffect } from 'react'
import { useParams } from 'react-router'
import '../styles/report.scss'
import { useInterview } from '../hooks/useInterview'
import { handleFollowUpQuestion } from '../services/interview.api'


const sections = [
  { id: 'behaviour', label: 'Behaviour questions' },
  { id: 'technical', label: 'Technical Questions' },
  { id: 'roadmap', label: 'Roadmap' }
]

const MockInterviewChat = ({ interviewId, question, questionType }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [answer, setAnswer] = useState('')
  const [isThinking, setIsThinking] = useState(false)
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
    setIsThinking(true)

    try {
      const response = await handleFollowUpQuestion(
        interviewId,
        questionType,
        question._id,
        trimmedAnswer
      )
      setMessages(response.conversation ?? [])
    } catch (error) {
      setMessages((currentMessages) => [
        ...currentMessages,
        { sender: 'ai', text: 'I could not review that answer. Please try again.' }
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
        <span>{isOpen ? 'Close practice' : 'Practice answer'}</span>
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
  const { report, loading, getReportById, getResumePdf } = useInterview()

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
          <MockInterviewChat interviewId={interviewId} question={item} questionType='behavioral' />
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
          <MockInterviewChat interviewId={interviewId} question={item} questionType='technical' />
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
  }, [activeSection, report])

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
          <div className="download-resume">
            <button
              onClick={() => getResumePdf(interviewId)}
              type='button' className=' button btn'>Download Resume
            </button>
          </div>
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
