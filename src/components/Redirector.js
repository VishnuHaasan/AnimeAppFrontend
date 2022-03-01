import { useLocation, useNavigate } from "react-router-dom"
import { useEffect } from "react/cjs/react.development"

const Redirector = () => {
    const {state} = useLocation()
    const navigate = useNavigate()
    const onStart = () => {
        navigate(state)
    }
    useEffect(() => {
        onStart()
    },[])
    return(
        <div></div>
    )
}

export default Redirector