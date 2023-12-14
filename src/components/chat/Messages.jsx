import { ref, onValue } from "firebase/database";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../auth/ChatContext";
import { db } from "../../firebase";
import Message from "./Message";

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const { data } = useContext(ChatContext);

    useEffect(() => {
        const chatRef = ref(db, `Chat/${data.chatId}/messages`);
        const unsubscribe = onValue(chatRef, (snapshot) => {
            const messageData = snapshot.val();
            if (messageData) {
                const messageList = Object.keys(messageData).map((key) => ({
                    id: key,
                    ...messageData[key],
                }));
                setMessages(messageList);
            }
        });

        return () => {
            unsubscribe();
        };
    }, [data.chatId]);

    return (
        <div className="messages">
            {messages.map((m) => (
                <Message message={m} key={m.id} />
            ))}
        </div>
    );
};

export default Messages;
