import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import config from "../config";
import useInput from "../hooks/inputHook";
import { bindActionCreators } from "redux";
import { actionCreators } from "../state";

const Login = () => {
    const {value: email, bind: bindEmail, reset: resetEmail} = useInput("")
    const {value: password, bind: bindPassword, reset: resetPassword} = useInput("")
    const auth = useSelector(state => state.auth)
    const [errMsg, setErrMsg] = useState("")
    const dispatch = useDispatch()
    const {LogIn, LoggingIn} = bindActionCreators(actionCreators, dispatch)
    const navigate = useNavigate()
    const onSubmit = (e) => {
        e.preventDefault()
        const data = {
            email,
            password
        }
        LoggingIn()
        axios.post(`${config.EntityServer}/user/login`,data).then((res) => {
            console.log(res.data)
            if(res.data.result){
                let data = {
                    type: 'LOGGEDIN',
                    result: res.data
                }
                console.log(data)
                LogIn(data)
                navigate('/redirect', {state: '/'})
                resetEmail()
                resetPassword()
            }
        }).catch(err => {
            console.log(err)
            const msg = err.response.data.msg
            setErrMsg(msg)
        })
    }
    useEffect(() => {
        if(auth.isLoggedIn){
            navigate('/redirect', {state: '/'})
        }
        else{
            const token = localStorage.getItem('jwtToken')
            if(token) {
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
                    navigate('/redirect', {state: '/'})
                }).catch(err => {
                    console.log(err)
                    LogIn({type: 'LOGINERR'})
                    navigate('/redirect', {state: '/login'})
                })
            }
        }
    },[])
    const onRedirect = () => {
        navigate('/redirect', {state: '/register'})
    }
    return(
    <div className="h-screen bg-gradient-to-r from-slate-900 to-slate-700 flex justify-center items-center w-full">
    <form>
        <div className="bg-cyan-500 px-10 py-8 rounded-xl w-screen shadow-md max-w-sm">
        <div className="space-y-4">
            <h1 className="text-center text-2xl font-jetbrains text-violet-800">Login</h1>
            <div>
            <label htmlFor="email" className="block mb-1 text-violet-800 font-jetbrains">Email</label>
            <input type="text" {...bindEmail} className="bg-indigo-100 px-4 py-2 outline-none rounded-md w-full text-violet-500 font-jetbrains" />
            </div>
            <div>
            <label htmlFor="email" className="block mb-1 text-violet-800 font-jetbrains">Password</label>
            <input type="text" {...bindPassword} className="bg-indigo-100 px-4 py-2 outline-none rounded-md w-full text-violet-500 font-jetbrains" />
            </div>
        </div>
        <button className="mt-4 w-full bg-gradient-to-r from-slate-900 to-slate-700 text-indigo-100 py-2 rounded-md text-lg tracking-wide" onClick={onSubmit}>Login</button>
        <button className="mt-4 w-full bg-gradient-to-r from-slate-900 to-slate-700 text-indigo-100 py-2 rounded-md text-lg tracking-wide" onClick={onRedirect}>Dont have an account, Register Instead</button>
        <p className="text-lg text-violet-800 text-center mt-2">{errMsg}</p>
        </div>
    </form>
    </div>
    )
}

export default Login