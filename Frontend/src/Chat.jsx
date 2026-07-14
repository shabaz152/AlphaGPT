import "./Chat.css";
import { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";

import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";


function Chat() {
    const { newChats, prevChats, reply } = useContext(MyContext);

    const [latestReply, setLatestReply] = useState(null);

    useEffect(() => {
        if (reply === null) {
            setLatestReply(null);
            return;
        }

        if (!prevChats?.length) return; 

        let index = 0;

        const interval = setInterval(() => {
            setLatestReply(reply.substring(0, index + 1));
            index++;

            if (index >= reply.length) {
                clearInterval(interval);
            }
        },10);

        return () => clearInterval(interval);
    }, [reply, prevChats]);

    return (
        <>
            {newChats && <h1>Begin with a new chat!</h1>}

            <div className="Chats">

                {prevChats?.slice(0, -1).map((chat, idx) => (
                    <div
                        key={idx}
                        className={chat.role === "user" ? "userDiv" : "gptDiv"}
                    >
                        {chat.role === "user" ? (
                            <p className="usermessage">
                                {chat.content}
                            </p>
                        ) : (
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm, remarkMath]}
                                rehypePlugins={[rehypeKatex, rehypeHighlight]}
                            >
                                {chat.content}
                            </ReactMarkdown>
                        )}
                    </div>
                ))}

                {prevChats.length > 0 && latestReply !== null && (
                    <div className="gptDiv" key="typing">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex, rehypeHighlight]}
                        >
                            {latestReply}
                        </ReactMarkdown>
                    </div>
                )}

                {prevChats.length > 0 && latestReply === null && (
                    <div className="gptDiv" key="non-typing">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex, rehypeHighlight]}
                        >
                            {prevChats[prevChats.length - 1].content}
                        </ReactMarkdown>
                    </div>
                )}

            </div>
        </>
    );
}

export default Chat;