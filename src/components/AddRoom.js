import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import config from "../config";
import useInput from "../hooks/inputHook";
import useAuthenticator from "./Authenticator";

const AddRoom = () => {
    const [entity,setEntity] = useState("")
    const [episode,setEpisode] = useState("0")
    const {value: startTime,bind: bindStartTime,reset: resetStartTime} = useInput("")
    const {value: playTime,bind: bindPlayTime,reset: resetPlayTime} = useInput(0)
    const {value: name,bind: bindName,reset: resetName} = useInput("")
    const {value: password, bind: bindPassword, reset: resetPassword} = useInput("")
    const [token, setToken] = useState("")
    const [ad, setAd] = useState(false)
    const [entities, setEntities] = useState([])
    const [options, setOptions] = useState([])
    const auth = useSelector(state => state.auth)
    const [done,setDone] = useState(false)
    const func = (token) => {
        setToken(token)
        const headers = {
            'Authorization': token
        }
        axios.get(`${config.EntityServer}/adminentity/`,{headers}).then(res => {
            let {data} = res
            if(data.result) {
                const arr = data.data.map(ele => {
                    const eleRes = {
                        "entity": ele.id,
                        "name": ele.title,
                        "episodes": ele.episodes
                    }
                    return eleRes
                })
                setEntities(arr)
            }
        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        setAd(auth.isAdmin)
    },[auth])

    useAuthenticator(func)

    useEffect(() => {
        if(entities.length <= 0){
            return
        }
        const res = entities.map(ele => {
            return (
                <option value={ele.entity} key={ele.entity}>{ele.name}</option>
            )
        })
        setOptions(res)
    },[entities])

    const getEntityById = (id) => {
        for(let i = 0;i < entities.length;i++){
            if(entities[i].entity === id){
                return entities[i]
            }
        }
    }
    const onEntityChange = (e) => {
        setEntity(e.target.value)
    }

    const onEpisodeChange = (e) => {
        setEpisode(e.target.value)
    }

    const resetEntity = () => {
        setEntity("")
    }

    const resetEpisode = () => {
        setEpisode("")
    }

    const resetAll = () => {
        resetEntity()
        resetEpisode()
        resetName()
        resetPlayTime()
        resetStartTime()
        resetPassword()
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if(entity === "" || episode === 0 || startTime === 0 || playTime === 0 || name === "") {
            return
        }
        const headers = {
            'Authorization': token
        }

        const time = Math.floor(new Date(startTime).getTime() / 1000)
        const data = {
            name,
            "entity_id": entity,
            "episode_no": parseInt(episode),
            "play_time": parseInt(playTime),
            "start_time": time,
            password
        }
        axios.post(`${config.EntityServer}/adminroom/`,data,{headers}).then(res => {
            const data = res.data
            if(data.result){
                resetAll()
                setDone(true)
            }
        })
    }

    return(
        (ad) ?
        <div className="mt-32 ml-96 w-3/6 text-violet-500 font-jetbrains h-screen">
            <p className="text-5xl mb-4">Create Room</p>
            <label className="">
                Name: 
                <input type={"text"} {...bindName} className="mt-5 pl-3 bg-gray-700 border-2 border-cyan-500 ml-5 mb-5 rounded text-violet-500"/>
            </label><br></br>
            <label>
                Password: 
                <input type={"text"} {...bindPassword} className="mt-5 pl-3 bg-gray-700 border-2 border-cyan-500 ml-5 mb-5 rounded text-violet-500"/>
            </label><br></br>
            <label>
                Entity: 
                <select className="ml-8 mt-3" value={entity} onChange={onEntityChange}>
                    {options}
                </select>
            </label><br></br>
            <label>
                Episode:
                <input type="number" value={episode} onChange={onEpisodeChange} className="mt-5 ml-5 pl-3 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
            </label>
            <label className="block mb-5">
                Play Time: 
                    <input type="number" {...bindPlayTime} className="mt-5 ml-5 pl-3 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
            </label>
            <label className="block mb-5">
                Start Time: 
                    <input type="datetime-local" {...bindStartTime} className="mt-5 ml-5 pl-3 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
            </label>
            <button className="rounded-full mb-5 w-28 h-10 shadow-lg shadow-cyan-500/50 bg-cyan-500 text-white font-bold text-lg hover:shadow-cyan-500/90" onClick={handleSubmit}>Submit</button>
            {done ? <p>Created Room</p> : <div></div> } 
        </div> : <div className="mt-32 ml-32"><p className="text-violet-500 text-2xl">You Need to be an Admin.</p></div>
    )
}

export default AddRoom