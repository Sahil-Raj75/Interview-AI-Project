import React , {useState} from 'react'
import '../style/auth.form.scss'
import { useNavigate ,Link } from "react-router";
import { useAuth } from '../hooks/useAuth';


const Register = () => {
const {loading , handleregister} = useAuth();
const navigate = useNavigate();

const [username, setusername] = useState("")
const [email, setemail] = useState("")
const [password, setpassword] = useState("")

  const handleSubmit = async (e)=> {
      e.preventDefault();
      await handleregister({username , email , password})
      navigate('/login')
  }

  if(loading){
    return (
      <h1>loading.....</h1>
    )
  }

  return (
    <main>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <div className="input-group">
            <label htmlFor="email">Name</label>
            <input onChange={(e)=>setusername(e.target.value)} type="name" id='name' name='name' placeholder='Enter your name'/>
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input onChange={(e)=>setemail(e.target.value)} type="email" id='email' name='email' placeholder='Enter email address' />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input onChange={(e)=>setpassword(e.target.value)} type="password" id='password' name='password' placeholder='Enter password' />
          </div>

          <button className='button primary-button'>Register</button>

          <p>Already have an account ? <Link to={'/login'}>Login</Link></p>
        </div>
      </form>
    </main>
  )
}

export default Register