import axios from "axios"
import config from "../config"
import { actionCreators } from "../state"
import { bindActionCreators } from "redux"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

const useAuthenticator = (func) => {
    const auth = useSelector(state => state.auth)
    const navigate = useNavigate()
    let token = localStorage.getItem('jwtToken') 
    const dispatch = useDispatch()
    const {LogIn, LoggingIn} = bindActionCreators(actionCreators, dispatch)
    useEffect(() => {
        if(!token) {
            navigate('/redirect',{state: '/login'})
            return
        }
        else if(!auth.token){
            LoggingIn()
        const headers = {
            'Authorization': token
        }
        axios.get(`${config.EntityServer}/user/getuserdetails`,{headers}).then((res) => {
            let logindata = {
                type: 'LOGGEDIN',
                result: res.data
            }
            LogIn(logindata)
            func(token)
        }).catch(err => {
            console.log(err)
            LogIn({type: 'LOGINERR'})
            navigate('/redirect', {state: '/login'})
        })
        }
        else{
            return func(auth.token)
        }
    },[])
}

export default useAuthenticator