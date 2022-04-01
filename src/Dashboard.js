import React, {useContext, useEffect, useState} from "react";
import {Typography} from "@material-ui/core";
import './stylesheet.css'

import AssetItem from "./AssetItem";
import {Button, Input, Stack, TextField} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {UserContext} from "./UserContext";
import {GoogleLogout} from "react-google-login";

function Dashboard() {
  const {
    isLoggedIn,
    setLoggedIn,
    setAssetsList,
    assetsList,
    setCollectionsList,
    collectionsList,
    setError,
    error,
    userName,
    setUserName,
    setUserEmail,
    setAssetUrl,
    assetUrl,
    userEmail,
  } = useContext(UserContext);
  const navigate = useNavigate()


  useEffect(() => {
    getListFromDB(userEmail)
  }, [userEmail]);

  if (isLoggedIn)
    return (
      <div className="in-div-container-login">
        <div className="dashboard-item">
          <GoogleLogout
            buttonText="Logout"
            onLogoutSuccess={(response) => {
              logOutUser()
              navigate('/nft-alert-client/');
            }}/>

          <div className="dashboard-info-container">
            <div className="dashboard-info">
              <Typography variant="h4">
                {"Yo " + userName + "!"}
              </Typography>

              <br/>
              <div>
                <TextField fullWidth size="small" id="outlined" label="Your email" disabled value={userEmail}
                           margin="normal"/>

                <TextField fullWidth size="small" required id="outlined" label="Asset URL" value={assetUrl}
                           margin="normal"
                           onChange={(event) => {
                             setAssetUrl(event.target.value)
                           }}/>

                <Typography variant="colorError">{error}</Typography>

                <br/><br/><br/>

                <Stack direction="row" spacing={2}>
                  <Button variant="contained" className='button' onClick={(e) => {
                    e.preventDefault();
                    if (validateAssetURL(assetUrl)) {
                      upsertAsset(assetUrl)
                    }
                  }}>
                    Send Asset
                  </Button>
                  <Button variant="contained" className='button' onClick={(e) => {
                    e.preventDefault();
                    if (validateAssetURL(assetUrl)) {
                      upsertCollection(assetUrl)
                    }
                  }}>
                    Send Collection
                  </Button>

                  <Button variant="contained" className='button' onClick={(e) => {
                    e.preventDefault();

                    startStopLoop("start")
                  }}>
                    Start
                  </Button>

                  <Button variant="contained" className='button' onClick={(e) => {
                    e.preventDefault();

                    startStopLoop("stop")
                  }}>
                    Stop
                  </Button>

                  {/*<Button variant="contained" className='button' onClick={(e) => {*/}
                  {/*  e.preventDefault();*/}
                  {/*  startStopLoop("test")*/}
                  {/*}}>*/}
                  {/*  Test*/}
                  {/*</Button>*/}

                  <Button variant="contained" className='button' onClick={(e) => {
                    e.preventDefault();
                    getListFromDB(userEmail)
                  }}>
                    Refresh lists
                  </Button>

                  <Button variant="contained" color="error" className='button' onClick={(e) => {
                    e.preventDefault();

                    explodeDB(20)
                  }}>
                    EXPLODE!
                  </Button>

                  <Button variant="contained" color="error" className='button' onClick={(e) => {
                    e.preventDefault();
                    deleteAll()
                  }}>
                    DELETE DB!
                  </Button>
                </Stack>
              </div>
            </div>
          </div>
        </div>

        <div className="div-card-content">
          <br/>
          <AssetItem assets={assetsList} userEmail={userEmail} getUsersFunction={getListFromDB} mode="Assets"/>
        </div>

        <div className="div-card-content">
          <br/>
          <AssetItem assets={collectionsList} userEmail={userEmail} getUsersFunction={getListFromDB} mode="Collections"/>
        </div>
      </div>);
  else
    return (<div>
      <h2>Error getting you info!</h2>
      <h3>Redirecting to login page...</h3>
      {sleep(2000)}
    </div>);

  function sleep(delay) {
    let start = new Date().getTime();
    while (new Date().getTime() < start + delay);
    console.log("after")
    logOutUser()
    navigate('/nft-alert-client/');
  }

  function upsertAsset(url) {
    const upsertParams = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({"url": url, "user_email": userEmail, "mode": "Assets"})
    };
    fetch('https://alert-scraper.herokuapp.com/upsert_asset/', upsertParams)
      .then(response => response.json())
      .then(data => {
        setError(data["error"])
        setAssetUrl("")
        getListFromDB(userEmail)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  function upsertCollection(url) {
    const upsertParams = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({"url": url, "user_email": userEmail, "mode": "Collections"})
    };
    fetch('https://alert-scraper.herokuapp.com/upsert_asset/', upsertParams)
      .then(response => response.json())
      .then(data => {
        setError(data["error"])
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
    const params_assets = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"user_email": userEmail, "mode": "Assets"})
    };

    const params_collections = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"user_email": userEmail, "mode": "Collections"})
    };

    fetch('https://alert-scraper.herokuapp.com/get_assets_for_user/', params_assets)
      .then(response => response.json())
      .then(response => {
        setAssetsList(response)
      });

    fetch('https://alert-scraper.herokuapp.com/get_assets_for_user/', params_collections)
      .then(response => response.json())
      .then(response => {
        setCollectionsList(response)
      });
  }

  function explodeDB(num) {
    console.log("explodeDB with " + num + " of records");
    let url = "https://opensea.io/assets/0xed5af388653567af2f388e6224dc7c4b3241c544/"

    for (let i = 1; i < num + 1; i++) {
      upsertAsset(url + (i + 320).toString())
    }
  }

  function deleteAll() {
    console.log("delete all fro m asset col");
    fetch('https://alert-scraper.herokuapp.com/delete_all_from_assets_col')
      .then(response => response)
      .then(data => console.log(data))
      .catch((error) => {
        console.error('Error in deleteAll:', error);
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

  function logOutUser() {
    setLoggedIn(false)
    setUserEmail("")
    setUserName("")
    setAssetsList([])
  }

}


export default Dashboard;
