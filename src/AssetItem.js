import React from 'react';
import {Card, CardContent, IconButton, ListItem, ListItemText, Typography} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

const AssetItem = props => {
  return (
    <div>
      {Object.keys(props.assets).length > 0 ?
        <Card elevation={8}>
          <CardContent>
            <Typography variant="h5">
              My assets
            </Typography>
            <div>
              {Object.entries(props.assets).map(asset =>
                <ListItem
                  key={props.assets}
                  disableGutters
                  secondaryAction={
                    <IconButton aria-label="delete" color="primary">
                      <DeleteIcon onClick={(e) => {
                        e.preventDefault();

                        deleteUserFromAsset(asset, props.userEmail, props.getUsersFunction)
                      }}/>
                    </IconButton>}>
                  <a target="_blank"
                     href={stripAssetURL(asset.toString())}>{stripAssetURL(asset.toString())}
                  </a>
                </ListItem>
              )}
            </div>
          </CardContent>
        </Card> : ""}
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