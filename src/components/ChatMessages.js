import { useEffect, useRef, useState } from "react"

const ChatMessages = (props) => {
    const [messages, setMessages] = useState([])
    const {socket} = props
    const div = useRef(null)
    const [messageComps, setMessageComps] = useState([])
    const onMessage = (message) => {
        messages.push(message)
        const newArr = [...messages]
        setMessages(newArr)
    }
    useEffect(() => {
        socket.addEventListener('message', (ev) => {
            const data = JSON.parse(ev.data)
            if(data.type === 'message' || data.type === 'join' || data.type === 'leave')
            onMessage(data)
        })
    },[])
    useEffect(() => {
        const comps = messages.map(m => {
            if((m.type === 'join' || m.type === 'leave') && m.is_admin) {
                return(
                    <div className="ml-2">
                        <p className="text-lg text-red-500">{m.message}</p>
                    </div>
                )
            }
            else if(m.is_admin) {
                return(
                    <div className="ml-2">
                        <p className="text-lg text-red-500">{`${m.from}:   ${m.message}`}</p>
                    </div>
                )
            }
            else {
                return(
                    <div className="ml-2">
                        <p className="text-lg text-violet-500">{`${m.from}:   ${m.message}`}</p>
                    </div>
                )
            }
        })
        setMessageComps(comps)
    },[messages])
    const scrollToBottom = () => {
        div.current.scrollTop = div.current.scrollHeight
    }
    useEffect(() => {
        scrollToBottom()
    },[messageComps])
    return(
        <div ref={div} className="max-h-[550px] min-h-[550px] w-[100%] bg-slate-700 border-2 border-gray-800 overflow-y-scroll scrollbar-hide">
            {messageComps}
        </div>
    )
}

export default ChatMessages