import "./Chat.css";
import React, { useContext, useState, useEffect, useRef } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/github-dark.css";

function Chat() {
    const { newChat, prevChats, reply } = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);
    const [expandedMessages, setExpandedMessages] = useState({});
    const chatEndRef = useRef(null);

    const MAX_PREVIEW_LENGTH = 300;
    const WORD_LIMIT = 50;

    // Typing effect
    useEffect(() => {
        if (reply === null) {
            setLatestReply(null);
            return;
        }

        if (!prevChats?.length) return;

        const words = reply.split(" ");
        let idx = 0;

        const interval = setInterval(() => {
            setLatestReply(words.slice(0, idx + 1).join(" "));
            idx++;

            if (idx >= words.length) clearInterval(interval);
        }, 40);

        return () => clearInterval(interval);
    }, [prevChats, reply]);

    // Auto-scroll
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [prevChats, latestReply]);

    const toggleExpand = (key) => {
        setExpandedMessages(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    }

    const isLongMessage = (text) => {
        const wordCount = text.split(/\s+/).length;
        return wordCount > WORD_LIMIT;
    }

    const getPreview = (text) => {
        const words = text.split(/\s+/);
        if (words.length > WORD_LIMIT) {
            return words.slice(0, WORD_LIMIT).join(" ") + "...";
        }
        return text;
    }

    const renderMessage = (content, key) => {
        const isLong = isLongMessage(content);
        const isExpanded = expandedMessages[key];
        const displayText = isExpanded ? content : getPreview(content);

        return (
            <div className="response-wrapper" key={key}>
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                >
                    {displayText}
                </ReactMarkdown>
                {isLong && (
                    <button 
                        className="expand-btn"
                        onClick={() => toggleExpand(key)}
                    >
                        <i className={`fa-solid fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                        {isExpanded ? 'Show less' : 'Show more'}
                    </button>
                )}
            </div>
        );
    }

    return (
        <>
            {newChat && (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '60vh',
                    gap: '20px',
                    animation: 'fadeIn 0.5s ease'
                }}>
                    <div style={{
                        fontSize: '3rem',
                        animation: 'pulse 2s infinite'
                    }}>✨</div>
                    <h1 style={{ marginTop: '10px' }}>Start a New Chat!</h1>
                    <p style={{ color: 'rgba(180, 180, 180, 0.7)', maxWidth: '400px', textAlign: 'center' }}>
                        Ask me anything! I'm here to help with questions, creative tasks, analysis, and much more.
                    </p>
                </div>
            )}

            <div className="chats">
                {/* Previous chats */}
                {prevChats?.slice(0, -1).map((chat, idx) => (
                    <div
                        className={chat.role === "user" ? "userDiv" : "gptDiv"}
                        key={idx}
                    >
                        {chat.role === "user" ? (
                            <p className="userMessage">{chat.content}</p>
                        ) : (
                            <div className="chat-response">
                                {renderMessage(chat.content, `prev-${idx}`)}
                            </div>
                        )}
                    </div>
                ))}

                {/* Latest message */}
                {prevChats?.length > 0 && (
                    <div className="gptDiv">
                        <div className="chat-response">
                            {renderMessage(latestReply ?? prevChats[prevChats.length - 1].content, 'latest')}
                        </div>
                    </div>
                )}

                {/* Scroll anchor */}
                <div ref={chatEndRef}></div>
            </div>
        </>
    );
}

export default Chat;