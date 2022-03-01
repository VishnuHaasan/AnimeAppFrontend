import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";
import useInput from "../hooks/inputHook";

const Register = () => {
    const navigate = useNavigate()
    const {value: username, bind: bindUsername, reset: resetUsername} = useInput("")
    const {value: email, bind: bindEmail, reset: resetEmail} = useInput("")
    const {value: password, bind: bindPassword, reset: resetPassword} = useInput("")
    const [msg, setMsg] = useState("")
    const onSubmit = (e) => {
        e.preventDefault()
        const data = {
            username,
            email,
            password
        }
        axios.post(`${config.EntityServer}/user/`,data).then((res) => {
            if(res.data.result){
                console.log(res.data.data)
                resetUsername()
                resetEmail()
                resetPassword()
                setMsg("Your Account has been registered, wait till it gets activated!")
            }
        })
    }
    const onLogin = () => {
        
        navigate('/redirect', {state: '/login'})
    }
    return(
    <div className="h-screen bg-gradient-to-r from-slate-900 to-slate-700 flex justify-center items-center w-full">
    <form>
        <div className="bg-cyan-500 px-10 py-8 rounded-xl w-screen shadow-md max-w-sm">
        <div className="space-y-4">
            <h1 className="text-center text-2xl font-jetbrains text-violet-800">Register</h1>
            <div>
            <label htmlFor="email" className="block mb-1 text-violet-800 font-jetbrains">Username</label>
            <input type="text" {...bindUsername} className="bg-indigo-100 px-4 py-2 outline-none rounded-md w-full text-violet-500 font-jetbrains" />
            </div>
            <div>
            <label htmlFor="email" className="block mb-1 text-violet-800 font-jetbrains">Email</label>
            <input type="text" {...bindEmail} className="bg-indigo-100 px-4 py-2 outline-none rounded-md w-full text-violet-500 font-jetbrains" />
            </div>
            <div>
            <label htmlFor="email" className="block mb-1 text-violet-800 font-jetbrains">Password</label>
            <input type="text" {...bindPassword} className="bg-indigo-100 px-4 py-2 outline-none rounded-md w-full text-violet-500 font-jetbrains" />
            </div>
        </div>
        <button className="mt-4 w-full bg-gradient-to-r from-slate-900 to-slate-700 text-indigo-100 py-2 rounded-md text-lg tracking-wide" onClick={onSubmit}>Register</button>
        <button className="mt-4 w-full bg-gradient-to-r from-slate-900 to-slate-700 text-indigo-100 py-2 rounded-md text-lg tracking-wide" onClick={onLogin}>Have an account, Login Instead</button>
        <p className="text-lg text-violet-800 mt-2 text-center">{msg}</p>
        </div>
    </form>
    </div>
    )
}

export default Register