import React, { useEffect } from "react";

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

const AuthVerify = ({ logOut }) => {
  useEffect(() => {
    const checkTokenExpiration = () => {
      const user = JSON.parse(localStorage.getItem("user"));

      if (user) {
        const decodedJwt = parseJwt(user.accessToken);

        if (decodedJwt?.exp * 1000 < Date.now()) {
          logOut();
        }
      }
    };

    checkTokenExpiration();

    // Check token expiration every 6 seconds
    const interval = setInterval(checkTokenExpiration, 6000);

    return () => clearInterval(interval);
  }, [logOut]);

  return null;
};

export default AuthVerify;
