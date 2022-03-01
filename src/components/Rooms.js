import axios from 'axios'
import {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import config from '../config'
import useAuthenticator from './Authenticator'

const Rooms = () => {
    const [rooms, setRooms] = useState([])
    const [roomComps, setRoomComps] = useState([])
    const [noRooms, setNoRooms] = useState(false)
    const navigate = useNavigate()
    const func = (token) => {
        const headers = {
            'Authorization': token
        }
        axios.get(`${config.EntityServer}/room/`,{headers}).then(res => {
            if(res.data.result){
                let ids = []
                const data = res.data.data.map(ele => {
                    ids.push(ele.room.id)
                    return{
                        "name": ele.room.name,
                        "room_id": ele.room.id,
                        "episode_no": ele.room.episode_no,
                        "entity_id": ele.room.entity_id,
                        "cover_url": ele.entity.cover_url,
                        "entity_name": ele.entity.title,
                        "start_time": ele.room.start_time,
                        "password": ele.room.password,
                        "play_time": ele.room.play_time,
                    }
                })
                if(data.length <= 0){
                    setNoRooms(true)
                    return
                }
                const dixi = {ids}
                axios.post(`${config.RoomServer}/status`,dixi).then(res => {
                    const daxa = res.data
                    if(daxa.result){
                        const ids = daxa.data
                        for(const item in ids){
                            const d = ids[item]
                            const room = getRoomById(data,item)
                            room.is_over = d.is_over
                            room.started = d.started
                            room.count = d.count
                        }
                    }
                    setRooms(data)
                }).catch(err => {
                    console.log(err)
                    setNoRooms(true)
                })
            }
        }).catch(err => {
            setNoRooms(true)
            console.log(err.response)
        })
    }

    useAuthenticator(func)

    const onJoin = (ev) => {
        ev.preventDefault()
        const id = ev.target.getAttribute('val')
        const inp = document.getElementById(`input-${id}`).value
        const ep = ev.target.getAttribute('ep')
        const room = getRoomById(rooms,id)
        if(room.password === inp) {
            navigate('/redirect',{state: `/rooms/${id}/${ep}`})
        }
    }

    const getRoomById = (rooms,id) => {
        for(let i = 0;i < rooms.length;i++){
            if(rooms[i].room_id === id) {
                return rooms[i]
            }
        }
    }

    useEffect(() => {
        if(!rooms){
            return
        }
        const comps = rooms.map(ele => {
            let comp 
            if(!ele.started || ele.is_over) {
                comp = <div className='ml-2 my-2'><span className='w-4 h-4 rounded-full bg-red-600 inline-block'></span><span className='text-violet-500 font-jetbrains'>   Not Started</span></div>
            } else {
                comp = <div className='ml-2 my-2'><span className='w-4 h-4 rounded-full bg-green-400 inline-block'></span><span className='text-violet-500 font-jetbrains'>   Live</span></div>
            }
            return(
                <div className="m-10 order-1 min-w-[15%] max-w-[15%] hover:cursor-pointer border-4 border-cyan-500 shadow-lg shadow-cyan-500 h-fit" key={ele.room_id} id={ele.room_id} ep={ele.episode_no}>
                    <img className="object-fit min-w-full min-h-[85%] max-h-85%]" src={`${config.ImageServer}/image/${ele.cover_url}`} alt="entityimage"/>
                    <div className="">
                    <p className="text-violet-500 font-jetbrains ml-2 mt-2">{ele.name}</p>
                    <p className='text-violet-500 font-jetbrains ml-2 mt-2'>{`Count: ${ele.count}`}</p>
                    {comp}
                    <label className='text-violet-500 font-jetbrains ml-2'>
                        Password:
                        <input type="text" className='w-40 ml-2 bg-slate-500 rounded-sm border-2 border-cyan-500 text-violet-800 pl-2 ' id={`input-${ele.room_id}`} />
                    </label>
                    <button className='rounded-full my-4 mx-2 w-[90%] h-10 shadow-lg shadow-cyan-500/50 bg-cyan-500 text-white font-bold text-lg hover:shadow-cyan-500/90' onClick={onJoin} val={ele.room_id} ep={ele.episode_no}>Join</button>
                    </div>
                </div>
            )
        })
        setRoomComps(comps)
    },[rooms])

    return(
        <div className="rooms mx-auto mt-32">
            <p className="ml-20 text-violet-500 text-3xl">Rooms:</p>
            {(noRooms) ? <p className="mt-20 ml-20 text-violet-500 text-2xl">No Rooms.</p> : (rooms && rooms.length > 0) ? <div className="flex flex-row">{roomComps}</div>: <div></div>}
        </div>
    )
}

export default Rooms