const initialState = {
    isLoggedIn: false,
    userEmail: null,
    userId: null,
    isLoading: false,
    token: null,
    userName: null,
    isAdmin: null
  }
  
  const reducer = (state = initialState, action) => {
    switch(action.type){
      case "LOGGINGIN":
        return {
          ...state,
          isLoading: true,
        }
      case "LOGGEDIN": 
        return {
          ...state,
          userEmail: action.payload.data.email,
          userId: action.payload.data.id,
          isLoading: false,
          isLoggedIn: true,
          token: action.payload.data.token,
          userName: action.payload.data.user_name,
          isAdmin: action.payload.data.is_admin
        }
      case "LOGINERR":
        return {
          ...state,
          isLoading: false,
        }
      case "LOGOUT":
        return {
          ...state,
          isLoggedIn: false
        }
      default:
        return state
    }
  }
  
  export default reducer 