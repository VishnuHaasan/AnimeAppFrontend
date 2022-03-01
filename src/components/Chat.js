import { useSelector } from "react-redux"
import ChatMessages from "./ChatMessages"
import ChatInput from "./ChatInput"
const Chat = (props) => {
    const auth = useSelector(state => state.auth)
    const {socket} = props

    return(
        (socket) ? 
        <div className="flex-1 bg-white overflow-y-auto">
            <ChatMessages socket={socket} />
            <ChatInput socket={socket} auth={auth}/>
        </div> : <div></div>
    )
}

export default Chat