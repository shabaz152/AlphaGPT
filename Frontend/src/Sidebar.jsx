import "./Sidebar.css";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {

    const {
        allThreads,
        setAllThreads,
        currThreadId,
        setNewChats,
        setPrompt,
        setReply,
        setCurrThreadId,
        setPrevChats,
        setIsLoggedIn
    } = useContext(MyContext);

    const [showAll, setShowAll] = useState(false);

    const token = localStorage.getItem("token");

    const getAllThreads = async () => {

        try {

            const response = await fetch("http://localhost:2000/api/thread", {

                headers: {
                    Authorization: `Bearer ${token}`
                }

            });

            const res = await response.json();

            const filteredData = res.map(thread => ({
                threadId: thread.threadId,
                title: thread.title
            }));

            setAllThreads(filteredData);

        } catch (err) {

            console.log(err);

        }

    };

    useEffect(() => {

        getAllThreads();

    }, [currThreadId]);

    const createNewChat = () => {

        setNewChats(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);

    };

    const changeThread = async (newThreadId) => {

        setCurrThreadId(newThreadId);

        try {

            const response = await fetch(
                `http://localhost:2000/api/thread/${newThreadId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const res = await response.json();

            setPrevChats(res);
            setNewChats(false);
            setReply(null);

        } catch (err) {

            console.log(err);

        }

    };

    const deleteThread = async (threadId) => {

        try {

            const response = await fetch(
                `http://localhost:2000/api/thread/${threadId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const res = await response.json();

            console.log(res);

            setAllThreads(prev =>
                prev.filter(thread => thread.threadId !== threadId)
            );

            if (threadId === currThreadId) {
                createNewChat();
            }

        } catch (err) {

            console.log(err);

        }

    };

    const logout = () => {

        localStorage.removeItem("token");

        setIsLoggedIn(false);

        setAllThreads([]);
        setPrevChats([]);

    };

    const visibleThreads = showAll
        ? allThreads
        : allThreads.slice(0, 5);

    return (

        <section className="sidebar">

            <button onClick={createNewChat}>
                <img
                    src="src/assets/gptlogo.jpeg"
                    alt="GPT Logo"
                    className="logo"
                />
                <span>
                    <i className="fa-regular fa-pen-to-square"></i>
                </span>
            </button>

            <ul className="history">

                {visibleThreads?.map((thread, idx) => (

                    <li
                        key={idx}
                        onClick={() => changeThread(thread.threadId)}
                        className={
                            thread.threadId === currThreadId
                                ? "highlighted"
                                : ""
                        }
                    >

                        {thread.title}

                        <i
                            className="fa-solid fa-delete-left"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteThread(thread.threadId);
                            }}
                        ></i>

                    </li>

                ))}

            </ul>

            {allThreads.length > 5 && (

                <button
                    className="show-more-btn"
                    onClick={() => setShowAll(!showAll)}
                >
                    {showAll ? "Show Less ▲" : "Show More ▼"}
                </button>

            )}

            <button className="logout-btn" onClick={logout}>
                Logout
            </button>

            <div className="sign">
                <p>Made by Shazz✨</p>
            </div>

        </section>

    );

}

export default Sidebar;