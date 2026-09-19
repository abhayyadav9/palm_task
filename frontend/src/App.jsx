import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/layout/Home";
import Login from "./pages/authPage/Login";
import Signup from "./pages/authPage/Signup";
import { useAuth } from "./context/AuthContext";


function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" replace /> : <Login/>}/>
        <Route path="/register" element={<Signup/>} />
        <Route path="/home" element={user ? <Home user={user} /> : <Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to={user ? "/home" : "/"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;