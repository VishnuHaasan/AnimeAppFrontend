import axios from "axios"
import { useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import config from "../config"
import useAuthenticator from "./Authenticator"
import RoomPlayer from "./RoomPlayer"

const RoomPage = () => {
    const {id, ep} = useParams()
    const [ent,setEnt] = useState(null)
    const [socket, setSocket] = useState(null)
    const auth = useSelector(state => state.auth)

    const func = (token) => {
        const headers = {
            'Authorization': token
        }
        axios.get(`${config.EntityServer}/room/${id}`,{headers}).then((daxa) => {
            const data = daxa.data
            if(data.result) {
                setEnt(data.data.entity)
            }
        }).catch(err => {
            console.log(err)
        })
        const newSocket = new WebSocket(`${config.ChatServer}/${id}/${auth.userId}/${auth.userName}`)
        setSocket(newSocket)
        return () => {
            newSocket.close()
        }
    }

    useAuthenticator(func)

    if(ent) {
        return (
            <div className="video h-full w-fit mb-20">
                <p className="text-jetbrains text-5xl text-left mt-20 text-gray-400 w-3/6 mx-auto mb-20">{ent.title}</p>
                <RoomPlayer ep={ep} entity={ent} roomid={id} socket={socket} />
            </div> 
        )
    }
    else{
        return(
            <div></div>
        )
    }
}
export default RoomPage