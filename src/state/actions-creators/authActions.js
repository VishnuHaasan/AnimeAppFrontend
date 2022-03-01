export const LogIn = (data) => {
    if(data.result){
      localStorage.setItem('jwtToken',data.result.data.token)
    }
    return (dispatch) => {
      dispatch({
        'type': data.type,
        payload: data.result 
      })
    }
  }
  
  export const LoggingIn = () => {
    return (dispatch) => {
      dispatch({
        type: 'LOGGINGIN'
      })
    }
  }
  
  export const LogOut = () => {
    localStorage.removeItem('jwtToken')
    return (dispatch) => {
      dispatch({
        type: 'LOGOUT'
      })
    }
  }