import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import useAuthenticator from "./Authenticator"
import axios from "axios"
import config from "../config"
import { v4 } from "uuid"
const Home = () => {
    const [rating,setRating] = useState([])
    const [ratingComps, setRatingComps] = useState([])
    const [views,setViews] = useState([])
    const [viewComps, setViewComps] = useState([])
    const navigate = useNavigate()
    const getRating = (token) => {
        const headers = {
            'Authorization': token
        }
        axios.get(`${config.EntityServer}/entity/rating`,{headers}).then(res => {
            if(res.data.result){
                const arr = res.data.data.hits.hits.map(ele => {
                    const needed = ele._source
                    return needed
                })
                setRating(arr)
            }
        }).catch(err => {
            console.log(err)
        })
        axios.get(`${config.EntityServer}/entity/views`,{headers}).then(res => {
            if(res.data.result){
                const arr = res.data.data.hits.hits.map(ele => {
                    console.log(ele)
                    const needed = ele._source
                    return needed
                })
                setViews(arr)
            }
        }).catch(err => {
            console.log(err)
        })
    }
    useAuthenticator(getRating)
    const onClick = (ev) => {
        let ele = ev.target
        while(ele.getAttribute('id') === null) {
          ele = ele.parentNode
        }
        const id = ele.getAttribute('id')
        navigate('/redirect',{state: `/entity/${id}`})
    }
    useEffect(() => {
        let i = 11
        const comps = rating.map(ele => {
            i -= 1
            return(
                <div className="m-5 min-w-[15%] max-w-[15%] snap-center hover:cursor-pointer" onClick={onClick} key={v4()} id={ele.mongo_id}>
                    <img className="object-fit min-h-[75%] max-h-[75%]" src={`${config.ImageServer}/image/${ele.cover_url}`} />
                    <div className="">
                    <p className="text-violet-500 font-jetbrains">{ele.english}</p>
                    <p className="text-violet-500 font-jetbrains">{ele.rating}</p>
                    </div>
                </div>
            )
        })
        setRatingComps(comps)
    },[rating])
    useEffect(() => {
        let i = 11
        const comps = views.map(ele => {
            i -= 1
            return(
                <div className="m-5 min-w-[15%] max-w-[15%] snap-center hover:cursor-pointer" onClick={onClick} key={v4()} id={ele.mongo_id}>
                    <img className="object-fit min-h-[75%] max-h-[75%]" src={`${config.ImageServer}/image/${ele.cover_url}`} />
                    <div className="">
                    <p className="text-violet-500 font-jetbrains">{ele.english}</p>
                    <p className="text-violet-500 font-jetbrains">{`Views: ${ele.views}`}</p>
                    </div>
                </div>
            )
        })
        setViewComps(comps)
    },[views])
    return(
        <div className="home mx-auto">
            <p className="text-3xl text-violet-500 mt-[5%] ml-[11%]">Top Rated:</p>
            {(ratingComps && ratingComps.length > 0) ? <div className="snap-x flex gap-10 mt-[2%] overflow-hidden overflow-x-auto w-[80%] mx-auto scrollbar scrollbar-thumb-violet-500">{ratingComps}</div> : <div></div> }
            <p className="text-3xl text-violet-500 mt-[5%] ml-[11%]">Most Viewed:</p>
            {(viewComps && viewComps.length > 0) ? <div className="snap-x flex gap-10 mt-[2%] overflow-hidden overflow-x-auto w-[80%] mx-auto scrollbar scrollbar-thumb-violet-500">{viewComps}</div> : <div></div> }
        </div>
    )
}

export default Home