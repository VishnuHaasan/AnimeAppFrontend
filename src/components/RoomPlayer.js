import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import config from "../config"
import Chat from "./Chat"

const RoomPlayer = (props) => {
    const ep = parseInt(props.ep)
    const auth = useSelector(state => state.auth)
    const video = useRef(null) 
    const {roomid,socket} = props
    const [videostate, setVideostate] = useState({"first": true})
    const url = `${config.VideoServer}/video/${props.entity.slug}/${props.entity.episodes[ep-1].episode_url}`
    const subUrl = `${config.VideoServer}/captions/${props.entity.slug}/${props.entity.episodes[ep-1].episode_url.split(".")[0]}.vtt`
    const [str, setStr] = useState('Live')
    useEffect(() => {
        axios.get(`${config.RoomServer}/room/${roomid}`).then(res => {
            const data = res.data
            if(data.result){
                console.log(data)
                setVideostate(data.data)
            }
        }).catch(err => {
            console.log(err)
        })
        socket.addEventListener('message', (ev) => {
            const data = JSON.parse(ev.data)
            if(data.type === 'pause'){
                videostate.on_pause = true
                video.current.pause()
                setStr('Paused')
            } else if(data.type === 'resume') {
                videostate.on_pause = false
                if(video.current.paused){
                    video.current.play()
                    setStr('Live')
                }
            } else if(data.type === 'start') {
                videostate.on_pause = true
                video.current.play()
                setStr('Live')
            } else if(data.type === 'over') {
                videostate.is_over = true
                video.current.pause()
                setStr('Show is Over')
            }
        })
    },[])
    useEffect(() => {
        if(videostate.first){
            video.current.pause()
            setStr('Not Started')
            return
        }
        if(videostate.is_over){
            video.current.pause()
            setStr('Show is Over')
        }
        else if(!videostate.started){
            video.current.pause()
            setStr('Not Started')
        }
        else if(videostate.on_pause){
            video.current.pause()
            setStr('Paused')
        }
        else {
            if(video.current.paused){
                video.current.play()
                setStr('Live')
            }
        }
        video.current.currentTime = videostate.time_taken
    },[videostate])

    const onLive = () => {
        axios.get(`${config.RoomServer}/room/${roomid}`).then(res => {
            const data = res.data
            if(data.result){
                setVideostate(data.data)
            }
        }).catch(err => {
            console.log(err)
        })
    }

    const onPause = () => {
        axios.get(`${config.RoomServer}/pause/${roomid}`).then(res => {
            console.log(res.data)
        }).catch(err => {
            console.log(err)
        })
    }

    const onResume = () => {
        axios.get(`${config.RoomServer}/resume/${roomid}`).then(res => {
            console.log(res.data)
        }).catch(err => {
            console.log(err)
        })
    }

    const adminComp = <div className="flex-1"><button className="rounded-full ml-20 mt-5 w-28 h-10 mb-2 shadow-lg shadow-red-500/50 bg-red-500 text-white font-bold text-lg hover:shadow-red-500/90" onClick={onPause}>Pause</button><button className="rounded-full ml-20 mt-5 w-28 h-10 mb-2 shadow-lg shadow-green-500/50 bg-green-500 text-white font-bold text-lg hover:shadow-green-500/90" onClick={onResume}>Resume</button></div>

    return(
        <div className="">
            <div className="w-[100%] border-cyan-500 border-4 shadow-lg shadow-cyan-500/90 max-h-[610px] min-h-[610px] flex flex-row">
                <video width="75%" height="100%" className="flex flex-3" id={props.entity.id} crossOrigin="anonymous" ref={video} autoPlay>
                    <source src={url} type="video/mp4"/>
                    <track label="English" kind="subtitles" srcLang="en" src={subUrl} default></track>
                </video>
                <Chat roomid={roomid} socket={socket}/>
            </div>
            <div className="flex flex-row">
                <div className="flex-1">
                    <button className="rounded-full ml-20 mt-5 w-28 h-10 mb-2 shadow-lg shadow-cyan-500/50 bg-cyan-500 text-white font-bold text-lg hover:shadow-cyan-500/90" onClick={onLive}>Go Live</button>
                    <p className="text-violet-500 text-2xl ml-20">{`State: ${str}`}</p>
                </div>
                {auth.isAdmin ? adminComp : <div></div>}
            </div>
        </div>        
    )
}

export default RoomPlayer