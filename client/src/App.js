// import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter,
  Route,
  Routes,
  // Link
} from "react-router-dom";

import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';
import Auth from './hoc/auth';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route exact path="/" element={Auth(LandingPage, null, true)} />
          <Route path="/login" element={Auth(LoginPage, false)} />
          <Route path="/register" element={Auth(RegisterPage, false)} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
