import React from "react";
import Navbar from "./Navbar";
import Search from "./Search";
import Chats from "./Chats";

const ChatSidebar = () => {
    return (
            <div className='chat_sidebar'>
                <Navbar/>
                <Search/>
                <Chats/>
            </div>
    )
}

export default ChatSidebar