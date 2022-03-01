import { useState } from "react"

const ChatInput = (props) => {
    const {socket,auth} = props
    const [message, setMessage] = useState("")
    const onSubmit = () => {
        const data = {
            'user_name': auth.userName,
            'id': auth.userId,
            message,
            'is_admin': auth.isAdmin
        }
        socket.send(JSON.stringify(data))
        setMessage('')
    }
    const onMessageChange = (e) => {
        setMessage(e.target.value)
    }
    const onEnter = (ev) => {
        if(ev.keyCode === 13) {
            ev.preventDefault()
            onSubmit()
        }
    }

    return(
        <div className="w-[100%] h-[50px]">
            <input className="w-[75%] bg-slate-500 ml-2 text-violet-800 pl-2" onKeyUp={onEnter} value={message} onChange={onMessageChange}/>
            <button className="rounded-full ml-4 mr-2 my-2 w-20 h-8 mb-10 shadow-lg shadow-cyan-500/50 bg-cyan-500 text-white font-bold text-lg hover:shadow-cyan-500/90" onClick={onSubmit}>Send</button>
        </div>
    )
}

export default ChatInput