import './App.css';
import GoogleLogin from "react-google-login";
import React, {useEffect, useState} from "react";
import {Typography} from "@material-ui/core";

import background_image from "./assets/background.png";
import AssetItem from "./AssetItem";

function App() {
  const [userEmail, setUserEmail] = useState("");
  const [assetUrl, setAssetUrl] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [assetsList, setAssetsList] = useState([]);
  const [error, setError] = useState("");


  useEffect(() => {
    getListFromDB(userEmail)
  }, [userEmail]);

  return (
    <div className="user-form-container" style={{
      backgroundImage: `url(${background_image})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      width: '100%',
      height: '100vh',
    }}>
      <Typography variant="h4">
        {userName == "" ? "Please login with your google account" : "Yo " + userName + "!"}
      </Typography>
      <div className="container">
        {!isLoggedIn ?
          <GoogleLogin
            clientId={process.env.REACT_APP_OAUTH_CLIENT_ID}
            buttonText="Login"
            onSuccess={(response) => {
              console.log(response);
              setLoggedIn(true)
              setUserEmail(response.Du.tv)
              setUserName(response.Du.VX)
            }}
            onFailure={(response) => {
              console.log(response);
              setUserEmail(response)
            }}
            cookiePolicy={'single_host_origin'}
          />
          :
          <form>
            <p>
              Email:
              <input className='input' disabled name="email" type="text" value={userEmail}/>
            </p>


            <p>
              Asset URL:
              <input className='input' name="asset_url" type="text" value={assetUrl} onChange={(event) => {
                setAssetUrl(event.target.value)
              }}/>
            </p>

            <Typography variant="colorError">{error}</Typography>

            <div className='send-form-button'>
              <button className='button' onClick={(e) => {
                e.preventDefault();
                if (validateAssetURL(assetUrl)) {
                  upsertAsset()
                }
              }}>
                Send
              </button>

              <button className='button' onClick={(e) => {
                e.preventDefault();

                startStopLoop("start")
              }}>
                Start
              </button>

              <button className='button' onClick={(e) => {
                e.preventDefault();

                startStopLoop("stop")
              }}>
                Stop
              </button>

              <button className='button' onClick={(e) => {
                e.preventDefault();
                startStopLoop("test")
              }}>
                Test
              </button>

              <button className='button' onClick={(e) => {
                e.preventDefault();
                getListFromDB(userEmail)
              }}>
                List
              </button>
            </div>
          </form>}

        <div>
          <br/>
          <AssetItem assets={assetsList} userEmail={userEmail} getUsersFunction={getListFromDB}/>
        </div>
      </div>
    </div>

  );

  function upsertAsset() {
    const upsertParams = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({"url": assetUrl, "user_email": userEmail})
    };
    fetch('https://alert-scraper.herokuapp.com/upsert_asset/', upsertParams)
      .then(response => response.json())
      .then(data => {
        setError(data["error"])
        console.log('Success upsert_asset:', data);
        setAssetUrl("")
        getListFromDB(userEmail)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  function startStopLoop(state) {
    console.log(state);
    fetch('https://alert-scraper.herokuapp.com/' + state)
      .then(response => response)
      .then(data => console.log(data))
      .catch((error) => {
        console.error('Error in startStopLoop:', error);
      });
  }

  function getListFromDB(userEmail) {
    const params = {
      user_email: userEmail,
    };
    const options = {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    };

    console.log('params', params);

    fetch('https://alert-scraper.herokuapp.com/get_assets_for_user/', options)
      .then(response => response.json())
      .then(response => {

        console.log('uvuv', JSON.parse(JSON.stringify(response)));
        setAssetsList(JSON.parse(JSON.stringify(response)))
      });
  }


  function validateAssetURL(input_asset_url) {
    if (input_asset_url.length === 0) {
      setError("Enter a value")
      return false
    } else if (!/[A-Za-z0-9-_]/.test(input_asset_url)) {
      setError("Only english letters")
      return false
    } else {
      setError("")
    }

    setAssetUrl(input_asset_url)
    return true
  }

}


export default App;
