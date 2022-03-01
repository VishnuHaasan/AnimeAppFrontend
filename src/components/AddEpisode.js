import axios from "axios"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { useState } from "react/cjs/react.development"
import config from "../config"
import useInput from "../hooks/inputHook"
import useAuthenticator from "./Authenticator"

const getSlug = (s) => {
    let arr = s.split(" ")
    for(let i = 0;i < arr.length; i++) {
        arr[i] = arr[i].toLowerCase()
    }
    return arr.join('_')
}


const AddEpisode = () => {
    const {value: title, bind: bindTitle, reset: resetTitle} = useInput("")
    const {value: description, bind: bindDescription, reset: resetDescription} = useInput("")
    const {value: episodeNo, bind: bindEpisodeNo, reset: resetEpisodeNo} = useInput(0)
    const [videoFile, setVideoFile] = useState({})
    const [captionsFile, setCaptionsFile] = useState({})
    const [progress, setProgress] = useState(0)
    const [entity,setEntity] = useState({})
    const [isDone, setIsDone] = useState(false)
    const {id} = useParams()
    const [token, setToken] = useState("")
    const [ad,setAd] = useState(false)
    const auth = useSelector(state => state.auth)
    const func = (token) => {
        setToken(token)
        const headers = {
            'Authorization': token
        }
        setAd(auth.isAdmin)
        axios.get(`${config.EntityServer}/entity/${id}`,{headers}).then((res) => {
            let {data} = res
            if(data.result) {
                setEntity(data.data)
            }
        }).catch(err => {
            console.log(err)
        })
    }

    useAuthenticator(func)

    const onVideoChange = (ev) => {
        setVideoFile(ev.target.files[0])
    }

    const resetAll = () => {
        resetTitle()
        resetDescription()
        resetEpisodeNo()
    }

    const onCaptionsChange = (ev) => {
        setCaptionsFile(ev.target.files[0])
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        let formData = new FormData()
        formData.append('file',videoFile)
        axios.post(`${config.VideoServer}/videoupload/${entity.slug}/${getSlug(title)}`,formData, {headers: {
            "Content-Type": "multipart/form-data"
        }, onUploadProgress: data => {
            setProgress(Math.round((100 * data.loaded) / data.total))
        }}).then((d) => {
            let daxa = d.data
            console.log(daxa.data)
            if(daxa.result) {
                const data = {
                    title,
                    description,
                    episode_url: daxa.data.filename,
                    episode_no: parseInt(episodeNo)
                }
                const fData = new FormData()
                fData.append('file',captionsFile)
                axios.post(`${config.VideoServer}/captionupload/${entity.slug}/${getSlug(title)}`, fData, {headers: {
                    "Content-Type": "multipart/form-data"
                }}).then((res) => {
                    console.log(res.data.data)
                })
                const headers = {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
                axios.put(`${config.EntityServer}/adminentity/${entity.id}/episode`, data, {headers}).then((d) => {
                    let daxa = d.data
                    if(daxa.result) {
                        console.log(daxa)
                        resetAll()
                        setIsDone(true)
                    }
                })
            }
        })
    }

    return(
        (ad) ?
        <div className="mt-20 ml-96 w-3/6 text-violet-500 font-jetbrains h-screen">
            <p className="text-5xl mb-4">Add Episode</p>
            {entity ? <p className="text-5xl mb-4">{entity.title}</p> : <div></div>}
            <label className="mb-4">
                Title: 
                <input type={"text"} {...bindTitle} className="bg-gray-700 border-2 border-cyan-500 ml-5 mb-5 rounded text-violet-500"/>
            </label><br></br>
            <label>
                Description: 
                <input type={"text"} {...bindDescription} className="bg-gray-700 border-2 border-cyan-500 ml-5 mb-5 rounded text-violet-500"/>
            </label><br></br>
            <label>
                Episode No:
                <input type={"number"} {...bindEpisodeNo} className="bg-gray-700 border-2 border-cyan-500 ml-5 mb-5 rounded text-violet-500"/>
            </label>
            <label className="block mb-5">
                Video: 
                    <input type="file" name="" onChange={onVideoChange} className="mt-5 cursor-pointer block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
            </label>
            <div className="w-full bg-gray-200 h-1 mt-10 mb-10">
                <div className="bg-cyan-500 h-1" style={{width: `${progress}%`}}></div>
            </div>
            <label className="block mb-5">
                Captions: 
                    <input type="file" name="" onChange={onCaptionsChange} className="mt-5 cursor-pointer block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
            </label>
            <button className="rounded-full mb-5 w-28 h-10 shadow-lg shadow-cyan-500/50 bg-cyan-500 text-white font-bold text-lg hover:shadow-cyan-500/90" onClick={handleSubmit}>Submit</button>
            {isDone ? <p>Upload Done</p> : <div></div> } 
        </div> : <div className="mt-32 ml-32"><p className="text-violet-500 text-2xl">You Need to be an Admin.</p></div>
    )
}

export default AddEpisode