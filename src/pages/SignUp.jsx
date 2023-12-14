import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {auth, firestoreDb} from "../firebase";
import {  Link } from "react-router-dom";
import user_icon from "../components/assets/person.png";
import email_icon from "../components/assets/email.png";
import password_icon from "../components/assets/password.png";
import { doc, setDoc } from "firebase/firestore";

const SignUp = () => {
    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;

        // Sprawdzenie, czy e-mail ma poprawną domenę
        if (!email.endsWith("@doctor.com")) {
            setErr(true);
            setLoading(false);
            setTimeout(() => {
                setErr(false);
            }, 5000); // Komunikat zniknie po 5 sekundach
            return;
        }

        try {
            // Create user
            await createUserWithEmailAndPassword(auth, email, password);

            // Create user on Firestore
            await setDoc(doc(firestoreDb, "doctors", auth.currentUser.uid), {
                uid: auth.currentUser.uid,
                displayName,
                email,
            });
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
            }, 5000); // Komunikat zniknie po 5 sekundach

        } catch (err) {
            console.error(err);
            setErr(true);
            setLoading(false);
            setTimeout(() => {
                setErr(false);
            }, 5000); // Komunikat zniknie po 5 sekundach
        }
    };

    return (
        <div className="container">
            <div className="header">
                <div className="text">Sign Up</div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="inputs">
                    <div className="input">
                        <img src={user_icon} alt="" />
                        <input required type="text" placeholder="Name" />
                    </div>
                    <div className="input">
                        <img src={email_icon} alt="" />
                        <input required type="email" placeholder="Email" />
                    </div>
                    <div className="input">
                        <img src={password_icon} alt="" />
                        <input required type="password" placeholder="Password" />
                    </div>
                </div>
                <div className="submit-container">
                    <button className="submit gray" disabled={loading}>
                        Sign Up
                    </button>
                    <Link to="/login">
                        <button className="submit">Log In</button>
                    </Link>
                </div>

                {err && <span>Invalid email domain. You do not have permission.</span>}
                {success && <span>Account created successfully! You can now log in.</span>}
            </form>
        </div>
    );
};

export default SignUp;

