import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
    const {
        prompt,
        setPrompt,
        reply,
        setReply,
        currThreadId,
        setPrevChats,
        setNewChats,
        setIsLoggedIn
    } = useContext(MyContext);

    const [loading, setLoading] = useState(false);
    const [isOpen, setISOpen] = useState(false);

    const getReply = async () => {
        if (!prompt.trim()) return;

        setLoading(true);
        setNewChats(false);

        const token = localStorage.getItem("token");

        console.log("Message:", prompt);
        console.log("Thread ID:", currThreadId);
        console.log("Token:", token);

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/chat`,
                options
            );

            const res = await response.json();

            console.log("Status:", response.status);
            console.log(res);

            if (!response.ok) {
                throw new Error(res.error || "Something went wrong");
            }

            setReply(res.assistantResponse);
        } catch (err) {
            console.error(err);
            alert(err.message);
        }

        setLoading(false);
    };

    useEffect(() => {
        if (prompt && reply) {
            setPrevChats((prevChats) => [
                ...prevChats,
                {
                    role: "user",
                    content: prompt
                },
                {
                    role: "assistant",
                    content: reply
                }
            ]);
        }

        setPrompt("");
    }, [reply]);

    const handleProfileClick = () => {
        setISOpen(!isOpen);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
    };

    return (
        <div className="chatwindow">
            <div className="header">
                <span>
                    AlphaGPT <i className="fa-solid fa-chevron-down"></i>
                </span>

                <div className="Icon">
                    <span
                        className="usericon"
                        onClick={handleProfileClick}
                    >
                        <i className="fa-solid fa-user"></i>
                    </span>
                </div>
            </div>

            {isOpen && (
                <div className="dropDown">
                    <div className="dropDownItem">
                        Profile <i className="fa-solid fa-address-book"></i>
                    </div>

                    <div className="dropDownItem">
                        Upgrade Plan{" "}
                        <i className="fa-solid fa-up-right-from-square"></i>
                    </div>

                    <div className="dropDownItem">
                        Settings <i className="fa-solid fa-gear"></i>
                    </div>

                    <div className="dropDownItem" onClick={logout}>
                        Logout <i className="fa-solid fa-right-from-bracket"></i>
                    </div>
                </div>
            )}

            <Chat />

            <ScaleLoader color="#fff" loading={loading} />

            <div className="ChatInput">
                <div className="InputBox">
                    <input
                        placeholder="Ask Me Anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) =>
                            e.key === "Enter" ? getReply() : null
                        }
                    />

                    <div id="submit" onClick={getReply}>
                        <span>
                            <i className="fa-solid fa-arrow-up"></i>
                        </span>
                    </div>
                </div>

                <p className="Info">
                    AlphaGPT can make mistakes. Please verify critical
                    information from reliable sources.
                </p>
            </div>
        </div>
    );
}

export default ChatWindow;