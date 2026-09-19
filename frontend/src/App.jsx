import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/layout/Home";
import Login from "./pages/authPage/Login";
import Signup from "./pages/authPage/Signup";
import { useAuth } from "./context/AuthContext";


function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<Signup/>} />
        <Route path="/home" element={<Home user={user} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;