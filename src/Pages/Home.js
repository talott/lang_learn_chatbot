import { Route, Routes } from "react-router-dom";
import { Login, Signup } from "./../index";
import App from "./../App";

function Home() {
  return (
    <div className="Home">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default Home;