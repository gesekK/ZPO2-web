import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../auth/AuthContext";
import { ChatContext } from "../../auth/ChatContext";

const Message = ({ message }) => {
    const { currentUser } = useContext(AuthContext);
    const { data } = useContext(ChatContext);

    const ref = useRef();

    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    return (
        <div
            ref={ref}
            className={`message ${message.senderId === currentUser.uid && "owner"}`}
        >
            <div className="messageInfo">
                <img
                    src={
                        message.senderId === currentUser.uid
                            ? currentUser.profileImage // Użyj właściwości z obiektu currentUser zamiast photoURL
                            : data.user.profileImage // Użyj właściwości z obiektu data.user zamiast photoURL
                    }
                    alt=""
                />
                <span>just now</span>
            </div>
            <div className="messageContent">
                <p>{message.text}</p>
                {message.img && <img src={message.img} alt="" />}
            </div>
        </div>
    );
};

export default Message;
