import React from 'react'
import '../styles/style.scss'

const Home = () => {
    return (
        <main className='home'>
            <section className='report-generator-shell'>
                <aside className='side-nav'>
                    <nav>
                        <button className='nav-item active'>Dashboard</button>
                        <button className='nav-item'>Job Matcher</button>
                        <button className='nav-item'>Reports</button>
                        <button className='nav-item'>Saved Profiles</button>
                        <button className='nav-item'>Settings</button>
                    </nav>
                </aside>

                <div className='report-content'>
                    <header className='report-header'>
                        <div>
                            <h1>Report Generator</h1>
                            <p>Analyze candidate fit by comparing specific job requirements with professional backgrounds.</p>
                        </div>
                    </header>

                    <div className='report-layout'>
                        <section className='panel left-panel'>
                            <div className='panel-title'>
                                <span>JOB DESCRIPTION</span>
                            </div>
                            <textarea
                                name='jobDescription'
                                id='jobDescription'
                                placeholder='Paste the full job description here, including responsibilities, technical requirements, and soft skills...'
                                rows={14}
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
                                <input type='file' name='resume' id='resume' accept='.pdf,.doc,.docx' />
                            </div>

                            <div className='panel-group'>
                                <label htmlFor='selfDescription' className='panel-label'>SELF DESCRIPTION</label>
                                <textarea
                                    name='selfDescription'
                                    id='selfDescription'
                                    placeholder="Add notes about the candidate's personality, interview performance, or specific cultural fit observations..."
                                    rows={6}
                                />
                            <button className='button'>Generate the report</button>
                            </div>

                            <p className='hint'>*AI-driven analysis typically takes 10-15 seconds.</p>
                        </section>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Home