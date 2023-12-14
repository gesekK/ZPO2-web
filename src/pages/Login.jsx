import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import '../styles/LoginSignUp.css'
import email_icon from '../components/assets/email.png'
import password_icon from '../components/assets/password.png'


const Login = () => {
    const [err, setErr] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;

        try {
            // Sprawdzenie, czy użytkownik istnieje
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Sprawdzenie, czy email kończy się na @doctor.com
            if (user.email && !user.email.endsWith("@doctor.com")) {
                setErr(true);
                setTimeout(() => {
                    setErr(false);
                }, 3000); // Komunikat zniknie po 3 sekundach
                return;
            }

            navigate("/");
        } catch (err) {
            setErr(true);
            setTimeout(() => {
                setErr(false);
            }, 3000); // Komunikat zniknie po 3 sekundach
        }
    };
    return (
        <div className="container">
                <div className='header'>
                    <div className='text'>Log In</div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='inputs'>
                        <div className='input'>
                            <img src={email_icon} alt=''/>
                            <input type='email' placeholder='Email'/>
                        </div>
                        <div className='input'>
                            <img src={password_icon} alt=''/>
                            <input type='password' placeholder='Password'/>
                        </div>
                    </div>

                    <div className='submit-container'>
                        <Link to="/register">
                        <button className='submit'>Sign Up</button>
                        </Link>
                        <button className='submit gray'>Log In</button>
                    </div>
                    {err && <span>You don't have permission</span>}
                </form>
        </div>
    );
};

export default Login;