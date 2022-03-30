import React, {createContext, useState} from "react";

const UserContext = createContext("default website");

const UserProvider = ({children}) => {
  const [userEmail, setUserEmail] = useState("");
  const [assetUrl, setAssetUrl] = useState("");
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [assetsList, setAssetsList] = useState([]);
  const [error, setError] = useState("");

  return (
    <UserContext.Provider
      value={{
        userEmail,
        setUserEmail,
        assetUrl,
        setAssetUrl,
        userName,
        setUserName,
        isLoggedIn,
        setLoggedIn,
        assetsList,
        setAssetsList,
        error,
        setError
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export {UserContext, UserProvider};