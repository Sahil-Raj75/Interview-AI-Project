import React, { useState, useRef } from 'react'
import '../style/auth.form.scss'
import { useNavigate, Link } from "react-router";
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const { loading, handleregister } = useAuth();
  const navigate = useNavigate();

  const [username, setusername] = useState("")
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
  const pageRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleregister({ username, email, password })
    navigate('/login')
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
          <img src="https://images.unsplash.com/photo-1720960292784-04caa31d60fa?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Professional setting for PrepFlow register background" />
          <div className="auth-visual__overlay"></div>
          <div className="auth-visual__text">
            <h1>Welcome to PrepFlow</h1>
            <p>Create your account to get started</p>
          </div>
        </section>

        <section className="auth-form-section">
          <div className="auth-form-wrapper">
            <div className="auth-header">
              <h2>Register</h2>
              <p>Create your PrepFlow account.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="name">Name</label>
                <input
                  onChange={(e) => setusername(e.target.value)}
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  onChange={(e) => setemail(e.target.value)}
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
                  onChange={(e) => setpassword(e.target.value)}
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter password"
                  required
                />
              </div>

              <button className="button primary-button" type="submit">
                Register
              </button>
            </form>

            <p className="auth-footer-text">
              Already have an account? <Link to={'/login'}>Login</Link>
            </p>
          </div>
        </section>

      </div>
    </main>
  )
}

export default Register