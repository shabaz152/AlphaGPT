import './App.css';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import {MyContext} from './MyContext.jsx';
import {useState, useEffect} from 'react';
import {v1 as uuidv1} from "uuid";
import Login from "./Login.jsx";
import "katex/dist/katex.min.css";

function App() {
  const [prompt,setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId ,setCurrThreadId] = useState(uuidv1());
  const [prevChats , setPrevChats] = useState([]);  
  const [newChats, setNewChats] = useState(true);
  const [allThreads ,setAllThreads] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
  const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  
  const ProviderValues = {
    prompt,setPrompt,
    reply , setReply,
    currThreadId, setCurrThreadId,
    newChats ,setNewChats,
    prevChats ,setPrevChats,
    allThreads, setAllThreads,
    isLoggedIn,setIsLoggedIn
  }; 

  return (
  <div className='app'>  
  <MyContext.Provider value={ProviderValues}>
       {
          isLoggedIn ? (
            <>
              <Sidebar />
              <ChatWindow />
            </>
          ) : (
            <Login />
          )
        }
      </MyContext.Provider>


    </div>
  )
      
  
}

export default App
