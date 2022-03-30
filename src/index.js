import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Dashboard from "./Dashboard";
import {UserProvider} from "./UserContext";

ReactDOM.render(
  <UserProvider>
    <BrowserRouter>
      <Routes>
        <Route path="nft-alert-client/" element={<App/>}/>
        <Route path="nft-alert-client/dashboard" element={<Dashboard/>}/>
      </Routes>
    </BrowserRouter>
  </UserProvider>,
  document.querySelector("#root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
