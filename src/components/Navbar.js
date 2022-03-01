import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react/cjs/react.development"
import config from './../config'   
import { bindActionCreators } from "redux"
import { actionCreators } from "../state"       
                                                                                              
const Navbar = () => {
  const navigate = useNavigate()
  const [text,setText] = useState("")  
  const onInputChange = (ev) => {
    setText(ev.target.value)
  }
  const dispatch = useDispatch()
  const {LogOut} = bindActionCreators(actionCreators, dispatch)
  const auth = useSelector(state => state.auth)
  const [searchResults, setSearchResults] = useState([])
  const [resComps, setResComps] = useState([])
  useEffect(() => {
    if(text === ""){
      return
    }
    const data = {
      "search_text": text
    }
    const token = auth.token || localStorage.getItem('jwtToken')
    const headers = {
      'Authorization': token
    }
    axios.post(`${config.EntityServer}/entity/search`,data,{headers}).then((res) => {
      let daxa = res.data.data
      if(daxa.hits.hits){
        const neededArr = daxa.hits.hits.map((hit) => {
          return{
            id: hit._id,
            cover_url: hit._source.cover_url,
            english: hit._source.english,
            japanese: hit._source.japanese,
            views: hit._source.views,
            mongo_id: hit._source.mongo_id
          }
        })
        console.log(neededArr)
        setSearchResults(neededArr)
      }
    })
  },[text, setSearchResults])

  const onDivClick = (ev) => {
    let ele = ev.target
    while(ele.getAttribute('id') === null) {
      ele = ele.parentNode
    }
    const id = ele.getAttribute('id')
    setText("")
    setResComps([])
    navigate(`/redirect`, {state: `/entity/${id}`})
  }

  const logOut = (e) => {
    LogOut()
    navigate('/redirect', {state: '/login'})
  }

  useEffect(() => {
    if(!searchResults){
      return
    }
    const arr = searchResults.map(s => {
      return(
        <div className="flex flex-row mt-3 hover:bg-gray-700 hover:cursor-pointer" key={s.mongo_id} id={s.mongo_id} onClick={onDivClick}>
          <div className="flex-1 w-full h-5/6">
            <img className="object-cover border-2 border-cyan-500" src={`${config.ImageServer}/image/${s.cover_url}`} alt={s.mongo_id} />
          </div>
          <div className="flex-2 w-5/6 h-full">
            <p className="text-xl text-violet-500 ml-2">{s.english}</p>
            <p className="text-md text-violet-500 ml-2">{s.japanese}</p>
          </div>
        </div>
      )
    })
    setResComps(arr)
  },[searchResults, setResComps])

return (
<div className="w-full">
<nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-800 fixed top-0 left-0 w-full max-h-15">
  <div className="container flex flex-wrap justify-between items-center mx-auto">
  <a href="#" className="flex">
    <img className="mr-3 h-10" src="./logo.svg"/>
      <span className="self-center text-lg font-semibold whitespace-nowrap dark:text-white">AnimeLoop</span>
  </a>
  <div className="flex md:order-2">
  <div className="flex justify-center mr-12">
  <div className="xl:w-80">
    <div className="input-group relative flex flex-wrap items-stretch w-full">
      <input type="search" className="form-control relative flex-auto min-w-0 block w-3/6 px-3 py-1.5 text-base font-normal text-violet-500 bg-gray-700 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:border-cyan-500 focus:outline-none" value={text} onChange={onInputChange} placeholder="Search" aria-label="Search" aria-describedby="button-addon2" />
    </div>
  </div>
</div>
      <button type="button" onClick={logOut} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">LogOut</button>
      <button data-collapse-toggle="mobile-menu-4" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="mobile-menu-4" aria-expanded="false">
      <span className="sr-only">Open main menu</span>
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
      <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
    </button>
  </div>
  <div className="hidden justify-between items-center w-full md:flex md:w-auto md:order-1" id="mobile-menu-4">
    <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
      <li>
        <Link to={'/'} className="block py-2 pr-4 pl-3 mr-8 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700" aria-current="page">Home</Link>
      </li>
      <li>
        <Link to={"/wishlist"} className="block py-2 pr-4 pl-3 mr-8 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">My WishList</Link>
      </li>
      <li>
        <Link to={"/rooms"} className="block py-2 pr-4 pl-3 mr-8 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Rooms</Link>
      </li>
    </ul>
  </div>
  </div>
</nav>
<div className="fixed right-[17%] top-14 bg-gray-800 w-80">
  <ul>
  <li>{(resComps && resComps.length > 0)? <div className="max-h-60 overflow-y-scroll scrollbar-hide border-2 border-t-0 border-gray-900">{resComps}</div>: <div></div>}</li>
  </ul>
</div>
</div>
)
}

export default Navbar