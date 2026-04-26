import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect, useRef } from "react";
import {ScaleLoader} from "react-spinners";

function ChatWindow() {
    const {prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat} = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [notification, setNotification] = useState(null);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const getReply = async () => {
        if (!prompt.trim()) {
            setNotification({ type: 'warning', message: 'Please enter a message' });
            setTimeout(() => setNotification(null), 2000);
            return;
        }

        setLoading(true);
        setNewChat(false);

        console.log("message ", prompt, " threadId ", currThreadId);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };

        try {
            const response = await fetch("http://localhost:8080/api/chat", options);
            const res = await response.json();
            console.log(res);
            setReply(res.reply);
            setNotification({ type: 'success', message: 'Response received!' });
            setTimeout(() => setNotification(null), 1500);
        } catch(err) {
            console.log(err);
            setNotification({ type: 'error', message: 'Failed to get response' });
            setTimeout(() => setNotification(null), 2000);
        }
        setLoading(false);
    }

    //Append new chat to prevChats
    useEffect(() => {
        if(prompt && reply) {
            setPrevChats(prevChats => (
                [...prevChats, {
                    role: "user",
                    content: prompt
                },{
                    role: "assistant",
                    content: reply
                }]
            ));
        }

        setPrompt("");
    }, [reply]);


    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            getReply();
        }
    }

    return (
        <div className="chatWindow">
            <div className="navbar">
                <span><i className="fa-solid fa-sparkles"></i> kiraAI</span>
                <div ref={dropdownRef} className="dropdown-container">
                    <div className="userIconDiv" onClick={() => setIsOpen(!isOpen)}>
                        <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                    </div>
                    {isOpen && (
                        <div className="dropDown">
                            <div className="dropDownItem"><i className="fa-solid fa-gear"></i> Settings</div>
                            <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                            <div className="dropDownItem"><i className="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
                        </div>
                    )}
                </div>
            </div>
            <Chat></Chat>

            {loading && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <ScaleLoader color="#6366f1" loading={loading} size={30} />
                    <span style={{ fontSize: '0.85rem', color: '#8b5cf6' }}>✨ Thinking...</span>
                </div>
            )}
            
            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder="Ask anything..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                    >
                           
                    </input>
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                </div>
                <p className="info">
                    💡 kiraAI can make mistakes. Always verify important information.
                </p>
            </div>
        </div>
    )
}

export default ChatWindow;