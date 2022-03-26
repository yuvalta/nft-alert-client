import './App.css';
import GoogleLogin from "react-google-login";
import React, {useEffect, useState} from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  Fade,
} from "@material-ui/core";

import logo from "./assets/pelican_logo.png";
import background_image from "./assets/background.png";


function App() {
  const [userEmail, setUserEmail] = useState("");
  const [assetUrl, setAssetUrl] = useState("");
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [assetsList, setAssetsList] = useState([]);


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
      <Typography variant="h2">
        Alerter
      </Typography>
      <div className="container">
        {!isLoggedIn ?
          <GoogleLogin

            clientId={process.env.REACT_APP_OAUTH_CLIENT_ID}
            buttonText="Login"
            onSuccess={(response) => {
              console.log(response.Du.tv);
              setLoggedIn(true)
              setUserEmail(response.Du.tv)
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
              <input className='input' name="email" type="text" value={userEmail} onChange={(event) => {
                setUserEmail(event.target.value)
              }}/>
            </p>

            <br/>
            <p>
              Asset URL:
              <input className='input' name="asset_url" type="text" value={assetUrl} onChange={(event) => {
                setAssetUrl(event.target.value)
              }}/>
            </p>

            <div className='send-form-button'>
              <button className='button' onClick={(e) => {
                e.preventDefault();

                const upsertParams = {
                  method: 'POST',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify({"url": assetUrl, "user_email": userEmail})
                };
                fetch('https://alert-scraper.herokuapp.com/upsert_asset/', upsertParams)
                  .then(response => response)
                  .then(data => {
                    console.log('Success:', data);
                    setAssetUrl("")
                    getListFromDB(userEmail)
                  })
                  .catch((error) => {
                    console.error('Error:', error);
                  });
              }}>
                Send
              </button>

              <button className='button' onClick={(e) => {
                e.preventDefault();
                console.log('Started:');
                fetch('https://alert-scraper.herokuapp.com/start')
                  .then(response => response)
                  .then(data => console.log("start " + data));
              }}>
                Start
              </button>

              <button className='button' onClick={(e) => {
                e.preventDefault();

                fetch('https://alert-scraper.herokuapp.com/stop')
                  .then(response => response)
                  .then(data => console.log("stop " + data));
              }}>
                Stop
              </button>

              <button className='button' onClick={(e) => {
                e.preventDefault();
                fetch('https://alert-scraper.herokuapp.com/test/')
                  .then(body => body.json())
                  .then(data => {
                    console.log('Success test:', data);
                  })
                  .catch((error) => {
                    console.error('Error test:', error);
                  });
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
          {Object.entries(assetsList).map(asset =>
            <a target="_blank"
               href={stripAssetURL(asset.toString())}>{stripAssetURL(asset.toString())}<br/><br/></a>)}
        </div>
      </div>
    </div>

  );

  function stripAssetURL(assetURL) {
    if (assetURL.length > 0) {
      return assetURL.substring(2)
    }

    return ""
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

}


export default App;
