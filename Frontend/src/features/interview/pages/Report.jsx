import { useMemo, useState } from 'react'
import '../styles/report.scss'

const reportData = {
  matchScore: 85,
  technicalQuestions: [
    {
      question: 'Design a globally distributed rate limiter that can handle millions of requests per second.',
      intention: 'To evaluate the candidate\'s understanding of distributed systems, scalability, consistency models, and multi-region synchronization.',
      answer: 'Start by clarifying requirements (RPS, tiering, accuracy). Discuss algorithms like Token Bucket or Leaky Bucket. Propose a multi-tier architecture using an API Gateway, local Redis instances for low latency, and a background synchronization mechanism. Address edge cases like clock skew, synchronization lag, and race conditions using Redis Lua scripts.'
    },
    {
      question: 'How would you find the longest consecutive sequence in an unsorted array of integers in O(N) time?',
      intention: 'To test the candidate\'s ability to optimize time complexity using appropriate data structures like HashSets.',
      answer: 'Insert all elements into a HashSet. Iterate through the array; for each number, check if it is the start of a sequence by verifying if \u201cnumber - 1\u201d is in the set. If it is the start, increment and count the sequence length. This ensures each element is visited at most twice, achieving O(N) time complexity.'
    },
    {
      question: 'Explain how consistent hashing works and why it is crucial in designing distributed cache systems.',
      intention: 'To assess the candidate\'s core knowledge of horizontal scaling and minimizing data movement during re-sharding.',
      answer: 'Explain the hash ring concept where both servers and keys are mapped using a hash function. When a node is added or removed, only a fraction of the keys need to be remapped. Mention the use of virtual nodes to ensure uniform distribution of keys across the physical servers.'
    },
    {
      question: 'Describe how you would diagnose and resolve a severe memory leak in a production Go application.',
      intention: 'To evaluate practical debugging skills, understanding of garbage collection, and familiarity with profiling tools.',
      answer: 'Explain the step-by-step diagnostic process: first, use metrics to confirm the memory leak. Next, use pprof to generate heap profiles at different intervals and compare them using \u201cgo tool pprof -base\u201d. Explain how to look for object accumulation in the inuse_space and identify the offending Goroutine or allocation path.'
    },
    {
      question: 'Given a heavy read, low write system, how would you design a caching strategy to minimize latency while maintaining eventual consistency?',
      intention: 'To test the candidate\'s trade-off analysis in choosing cache patterns (Cache-Aside, Write-Through) and eviction policies.',
      answer: 'Recommend a Cache-Aside pattern for this workload. Propose an appropriate TTL (Time-To-Live) to ensure eventual consistency, and discuss the use of a CDC (Change Data Capture) system or message broker to invalidate the cache whenever database updates occur to prevent stale data.'
    }
  ],
  behavioralQuestions: [
    {
      question: 'Tell me about a time you had a significant disagreement with a peer on an architectural decision. How did you resolve it?',
      intention: 'To evaluate collaboration, communication, empathy, and constructive conflict resolution skills under pressure.',
      answer: 'Use the STAR method. Describe the specific architectural disagreement, explain how you gathered data and benchmarks to objective-ize the discussion, actively listened to their perspective, and arrived at a consensus or committed to a shared decision (disagree and commit).'
    },
    {
      question: 'Describe a situation where you had to make a critical technical decision with highly incomplete or ambiguous information.',
      intention: 'To assess ambiguity tolerance, risk management, and decision-making frameworks.',
      answer: 'Detail a scenario where you faced missing requirements or unproved tech. Explain how you formulated hypotheses, built a quick POC (Proof of Concept) to gather data, documented assumptions, made a reversible decision (two-way door), and established monitoring to validate the choice.'
    },
    {
      question: 'Tell me about a major technical project you led that failed. What did you learn?',
      intention: 'To measure self-awareness, accountability, resilience, and the ability to extract constructive lessons from setbacks.',
      answer: 'Describe a real project setback without shifting blame. Focus on the root cause analysis, how you managed stakeholders during the failure, and the specific post-mortem items you implemented in subsequent projects to prevent similar occurrences.'
    }
  ],
  skillGaps: [
    { skill: 'Distributed Systems Scalability & Consistency Models', severity: 'high' },
    { skill: 'Low-level Performance Profiling & Optimization', severity: 'medium' }
  ],
  preparationPlan: [
    {
      day: 1,
      focus: 'System Design & Distributed Systems Fundamentals',
      tasks: [
        'Study consistent hashing, rate limiting, and CDN architectures.',
        'Review CAP theorem, PACELC, and distributed consensus algorithms like Raft.'
      ]
    },
    {
      day: 2,
      focus: 'Data Structures and O(N) Optimization',
      tasks: [
        'Solve 5 medium/hard LeetCode problems involving HashMaps and Sets.',
        'Practice time and space complexity analysis for recursive and iterative algorithms.'
      ]
    },
    {
      day: 3,
      focus: 'System Debugging and Profiling Tools',
      tasks: [
        'Simulate a memory leak in a local environment and profile it using pprof or Chrome DevTools.',
        'Read engineering blogs on production incident post-mortems.'
      ]
    },
    {
      day: 4,
      focus: 'Behavioral Preparation & STAR Framework',
      tasks: [
        'Draft 3 detailed behavioral stories focusing on conflict, failure, and ambiguity.',
        'Refine stories using the STAR framework, ensuring a strong focus on personal impact and lessons learned.'
      ]
    },
    {
      day: 5,
      focus: 'Mock Interviews & Strategy Review',
      tasks: [
        'Conduct at least one peer-to-peer system design mock interview.',
        'Review trade-offs for databases (NoSQL vs SQL) and caching strategies under time-constrained scenarios.'
      ]
    }
  ]
}

const sections = [
  { id: 'behaviour', label: 'Behaviour questions' },
  { id: 'technical', label: 'Technical Questions' },
  { id: 'roadmap', label: 'Roadmap' }
]

const Report = () => {
  const [activeSection, setActiveSection] = useState('technical')

  const sectionContent = useMemo(() => {
    if (activeSection === 'behaviour') {
      return reportData.behavioralQuestions.map((item, index) => (
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
      return reportData.technicalQuestions.map((item, index) => (
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
          {reportData.preparationPlan.map((item) => (
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
      return `${reportData.behavioralQuestions.length} behaviour questions with story-driven insights.`
    }

    if (activeSection === 'technical') {
      return `${reportData.technicalQuestions.length} technical questions reviewing system design, algorithms, and performance.`
    }

    return 'A concise 5-day preparation plan with focused study tasks and mock interview practice.'
  }, [activeSection])

  const sectionCount = useMemo(() => {
    if (activeSection === 'behaviour') return reportData.behavioralQuestions.length
    if (activeSection === 'technical') return reportData.technicalQuestions.length
    return reportData.preparationPlan.length
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
              <span>{reportData.matchScore}</span>
              <span><small>%</small></span>
            </div>
          </div>

          <div className='panel-block'>
            <span className='panel-label'>Skill gaps</span>
            <div className='skill-gaps'>
              {reportData.skillGaps.map((gap) => (
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
