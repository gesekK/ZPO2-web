import { useContext, useEffect, useState } from "react";
import { db } from "../../firebase";
import { AuthContext } from "../../auth/AuthContext";
import { ChatContext } from "../../auth/ChatContext";

const Chats = () => {
    const [users, setUsers] = useState([]);
    const [chats, setChats] = useState([]);
    const { currentUser } = useContext(AuthContext);
    const { dispatch } = useContext(ChatContext);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersRef = db.ref("Users");
                usersRef.on("value", (snapshot) => {
                    const usersList = [];
                    snapshot.forEach((childSnapshot) => {
                        const user = {
                            userId: childSnapshot.key,
                            ...childSnapshot.val(),
                        };
                        usersList.push(user);
                    });
                    setUsers(usersList);
                });
            } catch (error) {
                console.error("Error fetching users: ", error);
            }
        };

        const fetchChats = async () => {
            try {
                const userChatsRef = db.ref("Chat").orderByChild("senderID").equalTo(currentUser.uid);
                userChatsRef.on("value", (snapshot) => {
                    const chatsList = [];
                    snapshot.forEach((childSnapshot) => {
                        const chat = {
                            chatId: childSnapshot.key,
                            ...childSnapshot.val(),
                        };
                        chatsList.push(chat);
                    });
                    setChats(chatsList);
                });
            } catch (error) {
                console.error("Error fetching chats: ", error);
            }
        };

        currentUser.uid && fetchUsers();
        currentUser.uid && fetchChats();
    }, [currentUser.uid, dispatch]);

    const handleSelect = (u) => {
        dispatch({ type: "CHANGE_USER", payload: u });
    };

    return (
        <div className="chats">
            {users.map((user) => (
                <div
                    className="userChat"
                    key={user.userId}
                    onClick={() => handleSelect(user)}
                >
                    <img src={user.photoImage} alt="" />
                    <div className="userChatInfo">
                        <span>{user.userName}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Chats;
