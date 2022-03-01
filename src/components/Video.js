import axios from "axios";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import config from "../config";
import useAuthenticator from "./Authenticator";
import Player from "./Player";

const Video = () => {
    const [ent, setEnt] = React.useState(null)
    const ans = useParams()
    const navigate = useNavigate()
    const {episode, id} = ans
    const onClick = (ev) => {
        const ep = ev.target.getAttribute('newid')
        navigate('/redirect', {state: `/entity/${id}/${ep}`})
    }
    const getComps = () => {
        const leftLink = <button className="float-left text-violet-500" newid={parseInt(episode)-1} onClick={onClick}>{"<<<Previous Episode"}</button>
        const rightLink = <button className="float-right text-violet-500" newid={parseInt(episode)+1} onClick={onClick}>{"Next Episode>>>"}</button>
        let result = <div></div>
        if(episode > 1 && episode < ent.episodes.length){
            result =
                (<div className="w-3/5 mx-auto mt-8">
                    {leftLink}
                    {rightLink}
                </div>)
        }
        else if(episode > 1){
            result =
                (<div className="w-3/5 mx-auto mt-8">
                    {leftLink}
                </div>)
        }
        else if(episode < ent.episodes.length) {
            result =
                (<div className="w-3/5 mx-auto mt-8">
                    {rightLink}
                </div>)
        }
        return result
    }
    const func = (token) => {
        const headers = {
            'Authorization': token
        }
        axios.get(`${config.EntityServer}/view/${id}`, {headers}).catch(err => console.log(err))
        axios.get(`${config.EntityServer}/entity/${id}`,{headers}).then((daxa) => {
            const data = daxa.data
            if(data.result) {
                setEnt(data.data)
            }
        }).catch(err => {
            console.log(err)
        })
    }
    useAuthenticator(func)
    if(ent) {
        const comp = getComps()
        return (
            <div className="video h-full w-fit mb-20">
                <p className="text-jetbrains text-5xl text-left mt-20 text-gray-400 w-3/6 mx-auto">{ent.title}</p>
                <p className="text-jetbrains text-4xl text-left mt-10 mx-auto mb-20 text-gray-300 w-3/6 mx-auto">{`Episode: ${parseInt(episode)}`}</p>
                <Player ep={episode} entity={ent} />
                {comp}
            </div> 
        )
    }
    else{
        return(
            <div></div>
        )
    }
}

export default Video