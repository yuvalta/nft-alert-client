import React from 'react';

const AssetItem = props => {
  return (
    <div>
      {Object.entries(props.assets).map(asset => <div>

        <a target="_blank"
           href={stripAssetURL(asset.toString())}>{stripAssetURL(asset.toString())}
        </a>

        <button className="button" onClick={(e) => {
          e.preventDefault();

          deleteUserFromAsset(asset, props.userEmail, props.getUsersFunction)
        }}>
          Delete Asset
        </button>

        <br/><br/>

      </div>)}
    </div>
  );

  function stripAssetURL(assetURL) {
    if (assetURL.length > 0) {
      return assetURL.substring(2)
    }

    return ""
  }

  function deleteUserFromAsset(asset, userEmail, getUsersFunction) {
    const deleteParams = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({"url": stripAssetURL(asset.toString()), "user_email": userEmail})
    };

    console.log('deleteParams:', deleteParams);
    fetch('https://alert-scraper.herokuapp.com/delete_user_from_asset/', deleteParams)
      .then(response => response)
      .then(data => {
        console.log('Success:', data);
        getUsersFunction(userEmail)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
}

export default AssetItem;