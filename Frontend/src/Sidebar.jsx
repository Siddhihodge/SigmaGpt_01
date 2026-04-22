import "./Sidebar.css"

function Sidebar(){
    return(
       <section className="sidebar">
            {/* New chat button */}
            <button>
                <img src="src/assets/blacklogo.png" alt="Gpt logo"  className="logo"/>    
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>
            {/* Chat history */}
            <ul className="history">
                <li>Thread1</li>
                <li>Thread2</li>
                <li>Thread3</li>
            </ul>
            {/* sign */}
            <div className="sign">
                <p>Thanks for checking this out!</p> 
            </div>
        </section>
    )
}

export default Sidebar;