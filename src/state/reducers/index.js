import { combineReducers } from 'redux'
import reducer from './authReducer'
import authReducer from './authReducer'

const reducers = combineReducers({
  auth: authReducer
})

export default reducers
