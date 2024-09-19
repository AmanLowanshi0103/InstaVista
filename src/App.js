import Login from './Component/Login';
import Signup from './Component/Signup';
import Home from './Component/Home';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import OtpVerification from './Component/Otpverifaction';
import FgOtpVerification from './Component/FgOtpVerification';
import ForgotPassword from './Component/ForgotPassword';
import CreatePassword from './Component/CreatePassword';
import Profile from './Component/ProfilePage';
import EditProfile from './Component/EditProfile';
import UserProfile from './Component/UserProfile';
import { PostProvider } from './Reducers/ContextReducers';
import instaContext from './Context/instaContext';
import Settings from './Component/Settings';
import CreateNewPassword from './Component/CreateNewPassword';
import Messages from './Component/Messages';
import UserMessage from './Component/UserMessage';
 
function App() {
  return (
    
  <instaContext.Provider>
  <PostProvider>
  <Router>
    <Routes>
      <Route exact path="/" element={<Login/>}/>
      <Route exact path="/signup" element={<Signup/>}/>
      <Route exact path="/home" element={<Home/>}/>
      <Route exact path="/otpverification" element={<OtpVerification/>}/>
      <Route exact path="/fgotpverification" element={<FgOtpVerification/>}/>
      <Route exact path="/forgot-password" element={<ForgotPassword/>}/>
      <Route exact path="/createpassword" element={<CreatePassword/>}/>
      <Route exact path="/profile" element={<Profile/>}/>
      <Route exact path="/profile" element={<Profile/>}/>
      <Route exact path="/profile/:userName" element={<UserProfile/>}/>
      <Route exact path="/editprofile" element={<EditProfile/>}/>
      <Route exact path="/settings" element={<Settings/>}/>
      <Route exact path="/createnewpassword" element={<CreateNewPassword/>}/>
      <Route exact path="/messages" element={<Messages/>}/>
      <Route exact path="/message/:username" element={<UserMessage/>}/>
    </Routes>
  </Router>
  </PostProvider>
  </instaContext.Provider>
  );
}

export default App;
