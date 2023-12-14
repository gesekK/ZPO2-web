import React from 'react'
import ChatSidebar from '../components/chat/ChatSidebar'
import Chat from "../components/chat/Chat";
import "../styles/Chat.css"

const ChatPage = () => {
    return (
            <div className="chatContainer">
                <ChatSidebar/>
                <Chat/>
            </div>
    )
}

export default ChatPage