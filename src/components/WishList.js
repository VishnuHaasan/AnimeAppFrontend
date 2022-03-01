import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import config from "../config"
import useAuthenticator from "./Authenticator"

const WishList = () => {
    const [wishList, setWishList] = useState([])
    const [wishListComp, setWishListComp] = useState([])
    const navigate = useNavigate()
    const getList = (token) => {
        const headers = {
            'Authorization': token
        }
        axios.get(`${config.EntityServer}/user/wishlist/items`,{headers}).then(res => {
            if(res.data.result){
                setWishList(res.data.data)
            }
        }).catch(err => {
            console.log(err)
        })
    }
    useAuthenticator(getList)
    const onClick = (ev) => {
        let ele = ev.target
        while(ele.getAttribute('id') === null) {
          ele = ele.parentNode
        }
        const id = ele.getAttribute('id')
        navigate('/redirect',{state: `/entity/${id}`})
    }
    useEffect(() => {
        if(!wishList){
            return
        }
        const comps = wishList.map(ele => {
            return(
                <div className="m-10 order-1 min-w-[15%] max-w-[15%] hover:cursor-pointer border-4 border-cyan-500 shadow-lg shadow-cyan-500" onClick={onClick} key={ele.id} id={ele.id}>
                    <img className="object-fit min-w-full min-h-[85%] max-h-85%]" src={`${config.ImageServer}/image/${ele.cover_url}`} alt="entityimage" />
                    <div className="">
                    <p className="text-violet-500 font-jetbrains">{ele.title}</p>
                    <p className="text-violet-500 font-jetbrains">{ele.rating}</p>
                    </div>
                </div>
            )
        })
        setWishListComp(comps)
    },[wishList])

    return(
        <div className="wishlist mx-auto mt-32">
            <p className="ml-20 text-violet-500 text-3xl">My WishList:</p>
            {(wishList && wishList.length > 0) ? <div className="flex flex-row">{wishListComp}</div> : <p className="mt-20 ml-20 text-violet-500 text-2xl">Your WishList is Empty.</p>}
        </div>
    )
}

export default WishList