import "./Sidebar.css";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext.jsx";
import {v1 as uuidv1} from "uuid";

function Sidebar() {
    const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats} = useContext(MyContext);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const getAllThreads = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/thread");
            const res = await response.json();
            const filteredData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
            setAllThreads(filteredData);
        } catch(err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId])


    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    }

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        } catch(err) {
            console.log(err);
        }
    }   

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {method: "DELETE"});
            const res = await response.json();
            console.log(res);

            //updated threads re-render
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if(threadId === currThreadId) {
                createNewChat();
            }
            
            setDeleteConfirm(null);

        } catch(err) {
            console.log(err);
        }
    }

    const handleDeleteClick = (e, threadId, threadTitle) => {
        e.stopPropagation();
        setDeleteConfirm({ threadId, threadTitle });
    }

    const confirmDelete = () => {
        if (deleteConfirm) {
            deleteThread(deleteConfirm.threadId);
        }
    }

    const cancelDelete = () => {
        setDeleteConfirm(null);
    }

    return (
        <section className="sidebar">
            <button onClick={createNewChat}>
                <img src="src/assets/blacklogo.png" alt="kiraAI logo" className="logo"></img>
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>

            <ul className="history">
                {allThreads?.map((thread, idx) => (
                    <li key={idx} 
                        onClick={() => changeThread(thread.threadId)}
                        className={thread.threadId === currThreadId ? "highlighted": ""}
                        title={thread.title}
                    >
                        <i className="fa-solid fa-message"></i>
                        <span className="thread-title">{thread.title}</span>
                        <i className="fa-solid fa-trash"
                            onClick={(e) => handleDeleteClick(e, thread.threadId, thread.title)}
                        ></i>
                    </li>
                ))}
            </ul>
 
            <div className="sign">
                <p>✨ Thanks for using kiraAI!</p>
            </div>

            {deleteConfirm && (
                <div className="delete-modal-overlay" onClick={cancelDelete}>
                    <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="delete-modal-header">
                            <i className="fa-solid fa-triangle-exclamation"></i>
                            <h3>Delete Chat</h3>
                        </div>
                        <p className="delete-modal-message">
                            Are you sure you want to delete <span className="chat-name">'{deleteConfirm.threadTitle}'</span>? This action cannot be undone.
                        </p>
                        <div className="delete-modal-actions">
                            <button className="btn-cancel" onClick={cancelDelete}>
                                <i className="fa-solid fa-xmark"></i> Cancel
                            </button>
                            <button className="btn-delete" onClick={confirmDelete}>
                                <i className="fa-solid fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export default Sidebar;