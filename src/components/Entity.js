import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import config from "../config"
import useAuthenticator from "./Authenticator"
import StarRatings from "react-star-ratings"
import { useSelector } from "react-redux"

const Entity = () => {
    const {id} = useParams()
    const auth = useSelector(state => state.auth)
    const navigate = useNavigate()
    const [entity, setEntity] = useState({})
    const [comps, setComps] = useState([])
    const [starComp, setStarComp] = useState([])
    const [genreComp, setGenreComp] = useState([])
    const [wishList, setWishList] = useState([])
    const [wishListComp, setWishListComp] = useState([])
    const firstUpdate = useRef(true)
    const onButtonClick = (ev) => {
        const target = ev.target
        navigate(target.getAttribute('url'))
    }
    const func = (token) => {
        const headers = {
            'Authorization': token
        }
        axios.get(`${config.EntityServer}/view/${id}`, {headers}).catch(err => console.log(err))
        axios.get(`${config.EntityServer}/entity/${id}`,{headers}).then((d) => {
            const data = d.data
            if(data.result){
                setEntity(data.data)
            }
        }).catch(err => {
            console.log(err)
        })
        axios.get(`${config.EntityServer}/user/wishlist`,{headers}).then(d => {
            if(d.data.result){
                setWishList(d.data.data.wish_list)
            }
        }).catch(err => {
            console.log(err)
        })
    }
    
    useAuthenticator(func)

    const isAlreadyWished = (wishList) => {
        for(let i = 0;i < wishList.length; i++) {
            if(wishList[i] === id)
            return true
        }
        return false
    }

    useEffect(() => {
        if(firstUpdate.current) {
            firstUpdate.current = false
            return
        }
        setStarComp( <StarRatings rating={parseFloat(entity.rating)/2} starRatedColor='rgb(255,215,0)' starEmptyColor='rgb(203,211,227)' numberOfStars={5} name = 'Rating'/>)
        setGenreComp(<p className="flex-1 lg:text-2xl md:text-xl sm:text-lg text-base font-jetbrains text-gray-300 mr-5 mt-10">{`Genre: ${entity.genre.join(', ')}`}</p>)
        const cps = entity.episodes.map((epi, index) => {
            return(
                <button className="rounded-full mx-2 my-2 w-28 h-10 mb-10 shadow-lg shadow-cyan-500/50 bg-cyan-500 text-white font-bold text-lg hover:shadow-cyan-500/90" url={`/entity/${entity.id}/${index+1}`} key={index} onClick={onButtonClick}>
                    {epi.title}
                </button>
            )
        })
        setComps(cps)
    },[entity])

    const onWishClick = () => {
        const headers = {
            'Authorization': auth.token
        }
        axios.put(`${config.EntityServer}/user/entity/${id}`,{},{headers}).then((res) => {
            if(res.data.result){
                setWishList(res.data.data.wish_list)
            }
        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        if(!isAlreadyWished(wishList)){
            setWishListComp(<button className="rounded-lg mt-10 py-4 w-80 mb-10 shadow-lg shadow-cyan-500/50 bg-cyan-500 text-white font-bold text-lg hover:shadow-cyan-500/90 p-0" onClick={onWishClick}>+Add to WishList</button>)
        }
        else{
            setWishListComp(<button className="rounded-lg mt-10 py-4 my-2 w-80 mb-10 shadow-lg shadow-cyan-500/50 bg-cyan-500 text-white font-bold text-lg hover:shadow-cyan-500/90 p-0" onClick={onWishClick}>-Remove from WishList</button>)
        }
    },[wishList])

    return(
        (entity) ? 
        <div className="entity h-screen w-fit">
            <div className="flex flex-col w-full sm:flex-row">
                <div className="flex-1">
                    {(entity.cover_url) ? <img className="lg:w-2/5 md:h-full md:w-2/3 h-3/5 w-4/5 border-4 hover:border-8 border-cyan-500 object-cover mx-auto mt-40 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/90" src={`${config.ImageServer}/image/${entity.cover_url}`}/>:<div></div> }
                </div>
                <div className="flex-1 flex h-80 flex-col sm:mt-40 mt-20 sm:mx-auto mx-5">
                    <p className="flex-1 lg:text-5xl md:text-4xl sm:text-3xl font-jetbrains font-bold tracking-wide uppercase text-center text-xl text-gray-400 mr-5">{entity.title}</p>
                    <p className="flex-1 lg:text-2xl md:text-xl sm:text-lg text-base font-jetbrains text-gray-300 mr-5 mt-10 mb-5">{entity.description}</p>
                    {(starComp)? starComp : <div></div>} 
                    <p className="flex-1 lg:text-2xl md:text-xl sm:text-lg text-base font-jetbrains text-gray-300 mr-5 mt-10">{`Released: ${entity.released}`}</p>
                    {(wishListComp)? wishListComp : <div></div>}
                    <p className="flex-1 lg:text-2xl md:text-xl sm:text-lg text-base font-jetbrains text-gray-300 mr-5">{`Type: ${entity.type}`}</p>
                    {(genreComp)? genreComp : <div></div>}
                    <p className="flex-1 lg:text-2xl md:text-xl sm:text-lg text-base font-jetbrains text-gray-300 mr-5 mt-10">{`No of episodes: ${entity.episode_count}`}</p>
                    <p className="flex-1 lg:text-2xl md:text-xl sm:text-lg text-base font-jetbrains text-gray-300 mr-5 mt-10">{`Status: ${entity.status}`}</p>
                    <div className="ml-5 mt-10 mr-10">
                    {comps}
                    </div>
                </div>
            </div>
        </div> : <div></div>
    )
}

export default Entity