import React, { useState } from 'react'
import '../auth.form.scss'
import { useNavigate, Link } from "react-router";
import { useAuth } from '../hooks/useAuth.js'

const Login = () => {

  const { loading, handlelogin } = useAuth();
  const navigate = useNavigate();

  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handlelogin({ email, password })
    navigate('/')
  }

  if(loading){
  return (
    <main>
      <h1>loading....</h1>
    </main>
  )
}

  return (
    <main>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input onChange={(e) => { setemail(e.target.value) }} type="email" id='email' name='email' placeholder='Enter email address' />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input onChange={(e) => { setpassword(e.target.value) }} type="password" id='password' name='password' placeholder='Enter password' />
          </div>

          <button className='button primary-button'>Sign in</button>

          <p>Register before Login? <Link to={'/register'}>Register</Link></p>
        </div>
      </form>
    </main>
  )
}

export default Login