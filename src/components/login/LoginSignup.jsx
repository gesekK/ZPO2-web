import React, {useState} from 'react'
import '../../styles/LoginSignUp.css'

import user_icon from '../assets/person.png'
import email_icon from '../assets/email.png'
import password_icon from '../assets/password.png'
const LoginSignup = () => {

    const [action, setAction] = useState("Log In");

    return (
        <div className='container'>
            <div className='header'>
                <div className='text'>{action}</div>
            </div>
            <div className='inputs'>
                {action==='Log In'?<div></div>:  <div className='input'>
                    <img src={user_icon} alt=''/>
                    <input type='text' placeholder='Name'/>
                </div>}
                <div className='input'>
                    <img src={email_icon} alt=''/>
                    <input type='email' placeholder='Email'/>
                </div>
                <div className='input'>
                    <img src={password_icon} alt=''/>
                    <input type='password' placeholder='Password'/>
                </div>
            </div>
            {action==='Sign Up'?<div></div>: <div className='forgot-password'>Forgot password? <span>Click here!</span></div>}
            <div className='submit-container'>
                <div className={action==='Log In'?'submit gray':'submit'} onClick={()=>{setAction("Sign Up")}}>Sign Up</div>
                <div className={action==='Sign Up'?'submit gray':'submit'} onClick={()=>{setAction("Log In")}}>Log In</div>
            </div>

        </div>
    )
}
export default  LoginSignup