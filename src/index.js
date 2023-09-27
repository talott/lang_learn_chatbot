import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import "./App.scss";
import App from './App';
import Home from './Pages/Home';
import "react-toastify/dist/ReactToastify.css";

export {default as Login} from './Pages/Login';
export {default as Signup} from './Pages/Signup';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  </React.StrictMode>
);

