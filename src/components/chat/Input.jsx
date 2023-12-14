import React, { useContext, useState } from "react";
import { AuthContext } from "../../auth/AuthContext";
import { ChatContext } from "../../auth/ChatContext";
import {
    arrayUnion,
    doc,
    serverTimestamp,
    Timestamp,
    updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { v4 as uuid } from "uuid";

const Input = () => {
    const [text, setText] = useState("");

    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const handleSend = async () => {
        if (text.trim() === "") return; // Sprawdź, czy wiadomość nie jest pusta

        await updateDoc(doc(db, "Chat", data.chatId), {
            messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.userID, // Użyj właściwości zalogowanego użytkownika
                date: Timestamp.now(),
            }),
        });

        await updateDoc(doc(db, "userChats", currentUser.userID), {
            [data.chatId + ".lastMessage"]: {
                text,
            },
            [data.chatId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", data.user.userID), {
            [data.chatId + ".lastMessage"]: {
                text,
            },
            [data.chatId + ".date"]: serverTimestamp(),
        });

        setText("");
    };

    return (
        <div className="input">
            <input
                type="text"
                placeholder="Type something..."
                onChange={(e) => setText(e.target.value)}
                value={text}
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
};

export default Input;
