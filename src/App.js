import './App.css';
import GoogleLogin from "react-google-login";
import React, {useEffect, useState} from "react";


function App() {
  const [userEmail, setUserEmail] = useState("");
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [assetsList, setAssetsList] = useState("");

  useEffect(() => {
    fetch('https://alert-scraper.herokuapp.com/get_assets_for_user?user_email=tamir.yuval1@gmail.com')
      .then(response => response.json())
      .then(data => setAssetsList(data));
  }, []);

  return (
    <div className="App">
      {!isLoggedIn ?
        <GoogleLogin
          clientId={process.env.REACT_APP_OAUTH_CLIENT_ID}
          buttonText="Login"
          onSuccess={(response) => {
            console.log(response);
            setLoggedIn(true)
            setUserEmail(response.Du.tv)
          }}
          onFailure={(response) => {
            console.log(response);
            setUserEmail(response)
          }}
          cookiePolicy={'single_host_origin'}
        />
        : ""}

      <form>
        <p>
          Email:
          <input className='input' name="email" type="text" value={userEmail} onChange={(event) => {
            setUserEmail(event.target.value)
          }}/>
        </p>

        <br/>

        <div className='send-form-button'>
          <button className='button' onClick={() => {
            alert('נשלח!\n' + userEmail);
            // send to backend
          }}>
            Send!
          </button>
        </div>
      </form>

      <p>
        LIST!
        {assetsList}
      </p>
    </div>

  );
}

export default App;
