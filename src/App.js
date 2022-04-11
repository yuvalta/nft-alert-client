import GoogleLogin from "react-google-login";
import React, {useContext} from "react";
import {Typography} from "@material-ui/core";
import './stylesheet.css'
import logo from "./assets/pelican_logo.png"
import {Link, useNavigate} from "react-router-dom";
import {UserContext} from "./UserContext";

function App() {
  const {
    setLoggedIn,
    setError,
    userName,
    setUserName,
    setUserEmail
  } = useContext(UserContext);

  const navigate = useNavigate()

  return (
    <div className="container">
      <div className="flex-item">
        <Typography variant="h4">
          {userName == "" ? "Please login with your google account" : "Yo " + userName + "!"}
        </Typography>

        <br/><br/>
        <GoogleLogin
          clientId={process.env.REACT_APP_OAUTH_CLIENT_ID}
          buttonText="Login"
          onSuccess={(response) => {
            console.log(response);
            setLoggedIn(true)
            // setUserEmail(response.Du.tv)
            setUserEmail("940943671250002000")
            setUserName(response.Du.VX)
            navigate('/nft-alert-client/dashboard/');
          }}
          onFailure={(response) => {
            console.log(response);
            setError(response)
          }}
          cookiePolicy={'single_host_origin'}
        />
      </div>

      <div className="flex-item-colored">
        <div className="in-div-container-logo">
          <img className="logo" src={logo}/>
        </div>
      </div>

    </div>
  );
}


export default App;
