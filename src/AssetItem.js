import React from 'react';
import {Card, CardContent, IconButton, ListItem, ListItemText, Stack, Typography} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

const AssetItem = props => {
  return (
    <div>
      {Object.keys(props.assets).length > 0 ?
        <Card elevation={4}>
          <CardContent>
              <Typography variant="h5">
                My assets - {Object.keys(props.assets).length}
              </Typography>
              <div>
                {Object.values(props.assets).map(asset =>
                  <ListItem
                    disableGutters
                    secondaryAction={
                      <IconButton aria-label="delete" color="primary">
                        <DeleteIcon onClick={(e) => {
                          e.preventDefault();

                          deleteUserFromAsset(asset["url"], props.userEmail, props.getUsersFunction)
                        }}/>
                      </IconButton>}>
                    <Stack direction="row" spacing={3}>
                      <a target="_blank"
                         href={asset["url"]}>{asset["url"]}
                      </a>
                      <Typography variant="body1" color={asset["price"].toString() === "No price!" ? "red" : "green"}>
                        {asset["price"]}
                      </Typography>
                    </Stack>
                  </ListItem>
                )}
              </div>
          </CardContent>
        </Card>
        : ""}
    </div>
  );

  function deleteUserFromAsset(assetURL, userEmail, getUsersFunction) {
    const deleteParams = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({"url": assetURL, "user_email": userEmail})
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
};

export default AssetItem;