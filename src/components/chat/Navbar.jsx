import React, { useContext } from 'react'
import {signOut} from "firebase/auth"
import { auth } from '../../firebase'
import { AuthContext } from '../../auth/AuthContext'

const Navbar = () => {
    const {currentUser} = useContext(AuthContext)

    return (
        <div className='navbar'>
            <span className="logo">Chat</span>
            <div className="user">
                <span>{currentUser.displayName}</span>
=            </div>
        </div>
    )
}

export default Navbar