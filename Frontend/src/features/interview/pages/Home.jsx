import React from 'react'
import '../styles/style.scss'

const Home = () => {
    return (
        <div>
            <main className='home'>
                <div className="interview-group-data">
                    <div className="left">
                        <p>Job Description</p>
                        <textarea name="jobDescription" id="jobDescription" placeholder='Enter the Job Decription...'></textarea>
                    </div>

                    <div className="right">
                        <div className="input-group">
                            <p>Resume <small className='highlight'>(resume and selfDescription together can give more better result)</small></p>
                            <label className="file-label" htmlFor="resume">Upload Resume</label>
                            <input  type="file" name='resume' id='resume' accept='.pdf' />
                        </div>
                        <div className="input-group">
                            <label htmlFor="selfDescription">Self Description</label>
                            <textarea name='selfDescription' id='selfDescription' placeholder='Describe yourself in few sentences..'></textarea>
                        </div>
                        <button className='button'>Generate the report</button>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Home