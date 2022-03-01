import axios from "axios"
import { useState } from "react"
import { useSelector } from "react-redux"
import config from "../config"
import useInput from "../hooks/inputHook"
import useAuthenticator from "./Authenticator"

const AddEntity = () => {
    const {value: title,bind: bindTitle, reset: resetTitle} = useInput()
    const {value: description,bind: bindDescription, reset: resetDescription} = useInput()
    const [file,setFile] = useState("")
    const {value: japaneseName,bind: bindJapaneseName,reset: resetJapaneseName} = useInput()
    const {value: released,bind: bindReleased, reset: resetReleased} = useInput()
    const {value: status,bind: bindStatus, reset: resetStatus} = useInput()
    const [genre,setGenre] = useState([])
    const {value: rating,bind: bindRating, reset: resetRating} = useInput()
    const {value: slug,bind: bindSlug, reset: resetSlug} = useInput()
    const {value: type,bind: bindType, reset: resetType} = useInput()
    const {value: episodeCount,bind: bindEpisodeCount, reset: resetEpisodeCount} = useInput()
    const [token, setToken] = useState("")
    const [ad, setAd] = useState(false)
    const auth = useSelector(state => state.auth)
    useAuthenticator((token) => {setAd(auth.isAdmin);setToken(token)})

    const resetAll = () => {
        resetTitle()
        resetDescription()
        resetJapaneseName()
        resetReleased()
        resetSlug()
        resetStatus()
        resetRating()
        resetType()
        resetEpisodeCount()
        setGenre([])
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        let data = {
            title,
            description,
            japanese_name: japaneseName,
            released: parseInt(released),
            status,
            genre,
            rating,
            slug,
            type,
            episode_count: parseInt(episodeCount),
            episodes: []
        }
        const formdata = new FormData()
        formdata.append('file', file)
        axios.post(`${config.ImageServer}/upload/${slug}`,formdata).then((res) => {
            data['cover_url'] = res.data.data.Filename
            const headers = {
                'Authorization': token
            }
            axios.post(`${config.EntityServer}/adminentity/`,data,{headers}).then((res) => {
                console.log(res.data.data)
                resetAll()
            })
        })
    }

    const onFileChange = (e) => {
        setFile(e.target.files[0])
    }

    const onGenreChange = (e) => {
        const val = e.target.value
        const checked = e.target.checked
        let newArr = [...genre]
        if(checked) {
            newArr.push(val)
        }
        else{
            newArr = newArr.filter(g => g!==val)
        }
        setGenre(newArr)
    }

    const GenreLabels = ["Adventure","Action","Comedy","Slice of Life","Drama","Fantasy","Supernatural","Magic","Mystery","Horror","Psychological","Sci-Fi","Romance"]
    const CheckBoxes = GenreLabels.map(label => {
        return(
            <div className="checkbox">
                <input type={"checkbox"} value={label} key={label} onChange={onGenreChange} className="outline-1 outline outline-offset-0 outline-cyan-500 mr-2 mb-4"/>
                {label}
            </div>
        )
    })

    return(
        (ad) ? 
        <div className="mt-20 ml-96 w-3/6 text-violet-500 font-jetbrains">
            <label className="mb-4">
                Title: 
                <input type={"text"} {...bindTitle} className="bg-gray-700 border-2 border-cyan-500 ml-5 mb-5 rounded text-violet-500"/>
            </label><br></br>
            <label>
                Description: 
                <input type={"text"} {...bindDescription} className="bg-gray-700 border-2 border-cyan-500 ml-5 mb-5 rounded text-violet-500"/>
            </label><br></br>
            <label>
                Japanese Name: 
                <input type={"text"} {...bindJapaneseName} className="bg-gray-700 border-2 border-cyan-500 ml-5 mb-5 rounded text-violet-500"/>
            </label><br></br>
            <label>
                Released: 
                <input type={"number"} {...bindReleased} className="bg-gray-700 border-2 border-cyan-500 ml-5 mb-5 rounded text-violet-500"/>
            </label><br></br>
            <label>
                Status: 
                <input type={"text"} {...bindStatus} className="bg-gray-700 border-2 border-cyan-500 ml-5 mb-5 rounded text-violet-500"/>
            </label><br></br>
            <label>
                Episode Count: 
                <input type={"number"} {...bindEpisodeCount} className="bg-gray-700 border-2 border-cyan-500 ml-5 mb-5 rounded text-violet-500"/>
            </label><br></br>
            <label>
                Genre: 
                <div className="mt-5"></div>
                {CheckBoxes}
            </label><br></br>
            <label>
                Rating:
                <input type={"text"} {...bindRating} className="bg-gray-700 border-2 border-cyan-500 ml-5 mb-5 rounded text-violet-500"/>
            </label><br></br>
            <label>
                Slug:
                <input type={"text"} {...bindSlug} className="bg-gray-700 border-2 border-cyan-500 ml-5 mb-5 rounded text-violet-500"/>
            </label><br></br>
            <label>
                Type:
                <input type={"text"} {...bindType} className="bg-gray-700 border-2 border-cyan-500 ml-5 mb-5 rounded text-violet-500"/>
            </label><br></br>
            <label className="block mb-5">
                <span className="sr-only">Choose Cover photo</span>
                    <input type="file" name="" onChange={onFileChange} className="cursor-pointer block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
            </label>
            <button className="rounded-full mb-5 w-28 h-10 shadow-lg shadow-cyan-500/50 bg-cyan-500 text-white font-bold text-lg hover:shadow-cyan-500/90" onClick={handleSubmit}>Submit</button>
        </div> : <div className="mt-32 ml-32"><p className="text-violet-500 text-2xl">You Need to be an Admin.</p></div>
    )
}

export default AddEntity