import React, { useContext, useState } from "react";
import { ref, query, orderByChild, equalTo, get, set } from "firebase/database";
import { db } from "../../firebase";
import { AuthContext } from "../../auth/AuthContext";

const Search = () => {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    const [err, setErr] = useState(false);

    const { currentUser } = useContext(AuthContext);

    const handleSearch = async () => {
        const usersRef = ref(db, "Users");
        const userQuery = query(usersRef, orderByChild("userName"), equalTo(username));

        try {
            const snapshot = await get(userQuery);
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    setUser(childSnapshot.val());
                });
            } else {
                setUser(null);
                setErr(true);
            }
        } catch (error) {
            setErr(true);
        }
    };

    const handleKey = (e) => {
        e.code === "Enter" && handleSearch();
    };

    const handleSelect = async () => {
        const combinedId =
            currentUser.uid > user.userUID
                ? currentUser.uid + user.userUID
                : user.userUID + currentUser.uid;

        try {
            // Check if the chat exists
            const chatRef = ref(db, `Chat/${combinedId}`);
            const chatSnapshot = await get(chatRef);

            if (!chatSnapshot.exists()) {
                // Create a chat in Chat collection
                await set(ref(db, `Chat/${combinedId}`), {
                    senderID: currentUser.uid,
                    receivedID: user.userUID,
                    message: [],
                });

                // Update User's chat information
                await set(ref(db, `Users/${currentUser.uid}/Chats/${combinedId}`), {
                    userName: user.userName,
                    photoImage: user.photoImage,
                    date: Date.now(),
                });

                await set(ref(db, `Users/${user.userUID}/Chats/${combinedId}`), {
                    userName: currentUser.userName,
                    photoImage: currentUser.photoImage,
                    date: Date.now(),
                });
            }
        } catch (error) {
            console.error("Error selecting user:", error);
        }

        setUser(null);
        setUsername("");
    };

    return (
        <div className="search">
            <div className="searchForm">
                <input
                    type="text"
                    placeholder="Find a user"
                    onKeyDown={handleKey}
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                />
            </div>
            {err && <span>User not found!</span>}
            {user && (
                <div className="userChat" onClick={handleSelect}>
                    <img src={user.photoImage} alt="" />
                    <div className="userChatInfo">
                        <span>{user.userName}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Search;
