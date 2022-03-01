import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Entity from './components/Entity';
import Video from './components/Video';
import AddEntity from './components/AddEntity';
import AddEpisode from './components/AddEpisode';
import Redirector from './components/Redirector';
import WithNav from './components/WithNav';
import WithoutNav from './components/WithoutNav';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import WishList from './components/WishList';
import Rooms from './components/Rooms';
import RoomPage from './components/RoomPage';
import AddRoom from './components/AddRoom';

function App() {
  return (
    <Router>
        <div className="App bg-gradient-to-r from-slate-900 to-slate-700 h-full w-full">
          <Routes>
              <Route element={<WithoutNav />}>
                <Route exact path="/redirect" element={<Redirector />} />
                <Route exact path="/register" element={<Register />} />
                <Route exact path="/login" element={<Login />} />
              </Route>
              <Route element={<WithNav />}>
                <Route exact path='/' element={<Home />} />
                <Route exact path='/wishlist' element={<WishList />} />
                <Route exact path="/entity/:id" element={<Entity />} />
                <Route exact path="/admin/entity/add" element={<AddEntity />} />
                <Route exact path="/admin/entity/:id/addEpisode" element={<AddEpisode />}/>
                <Route exact path="/entity/:id/:episode" element={<Video />} />
                <Route exact path="/rooms" element={<Rooms />} />
                <Route exact path="/rooms/:id/:ep" element={<RoomPage />} />
                <Route exact path="/admin/room/add" element={<AddRoom />} />
              </Route>
          </Routes>
        </div>
    </Router>
  );
}

export default App;
