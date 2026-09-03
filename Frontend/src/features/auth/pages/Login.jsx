import { useState, useRef } from 'react'
import '../style/auth.form.scss'
import { useNavigate, Link } from "react-router";
import { useAuth } from '../hooks/useAuth.js'

const Login = () => {

  const { loading, handlelogin } = useAuth();
  const navigate = useNavigate();

  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const pageRef = useRef(null)
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await handlelogin({ email, password })
    navigate('/')
  }
  
  const handleMouseMove = (e) => {
    if (!pageRef.current) return
    const rect = pageRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    pageRef.current.style.setProperty('--cursor-x', `${x}px`)
    pageRef.current.style.setProperty('--cursor-y', `${y}px`)
  }

  if (loading) {
    return (
      <main className="auth-loading">
        <h1>loading....</h1>
      </main>
    )
  }

  return (
    <main className="auth-page" ref={pageRef} onMouseMove={handleMouseMove}>
      <div className="auth-cursor-glow"></div>
      <div className="auth-card">

        <section className="auth-visual">
          <img
            src="https://images.unsplash.com/photo-1577039547269-0899c0ec48e7?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Professional setting for PrepFlow login background"
          />
          <div className="auth-visual__overlay"></div>
          <div className="auth-visual__text">
            <h1>Structure your Future</h1>
            <p>Sign in to access your PrepFlow account</p>
          </div>
        </section>

        <section className="auth-form-section">
          <div className="auth-form-wrapper">
            <div className="auth-header">
              <h2>Login</h2>
              <p>Welcome back to PrepFlow.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  onChange={(e) => { setemail(e.target.value) }}
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  onChange={(e) => { setpassword(e.target.value) }}
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter password"
                  required
                />
              </div>

              <button className="button primary-button" type="submit">
                Login
              </button>
            </form>

            <p className="auth-footer-text">
              Don't have an account? <Link to={'/register'}>Register</Link>
            </p>
          </div>
        </section>

      </div>
    </main>
  )
}

export default Login