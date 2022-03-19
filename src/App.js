import './App.css';
import GoogleLogin from "react-google-login";
import React, {useEffect, useState} from "react";


function App() {
  const [userEmail, setUserEmail] = useState("");
  const [assetUrl, setAssetUrl] = useState("");
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [assetsList, setAssetsList] = useState("");

  useEffect(() => {
    console.log("stam4")

    // // fetch('https://alert-scraper.herokuapp.com/get_assets_for_user?user_email=' + userEmail)
    // fetch("https://alert-scraper.herokuapp.com/test")
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log(data);
    //     setAssetsList(JSON.stringify(data))
    //   }).catch(reason => console.log(reason));
  }, [userEmail, assetUrl]);

  return (
    <div className="App">
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
        : <form>
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
                })
                .catch((error) => {
                  console.error('Error:', error);
                });
            }}>
              Send
            </button>

            <button className='button' onClick={(e) => {
              e.preventDefault();

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

              console.log('before', JSON.stringify(params));
              fetch('https://alert-scraper.herokuapp.com/get_assets_for_user/', options)
                .then(response => response.json())
                .then(response => {
                  setAssetsList(JSON.stringify(response))
                  console.log('uvuv', response);
                });
            }}>
              List
            </button>
          </div>
        </form>}

      <p>
        {assetsList}
      </p>
    </div>

  );
}

export default App;
