import "./ChatWindow.css"
import Chat from "./chat.jsx";

function ChatWindow() {
    return (
        <div className="chatWindow"> 
           <div className="navbar">
             <span>SigmaGpt <i class="fa-solid fa-angle-down"></i></span>
            <span><div className="userIconDiv"><i class="fa-solid fa-user"></i></div></span>
           </div>
           <Chat></Chat>

           <div className="chatInput">
            <div className="InputBox">
                <input placeholder="Ask anything...">
                </input>
                <div id="submit"><i class="fa-solid fa-paper-plane"></i></div>
            </div>
            <p className="info">
                SigmaGpt can make mistakes, please verify critical information from reliable sources.
            </p>
           </div>
        </div>
        

    )
}

export default ChatWindow;