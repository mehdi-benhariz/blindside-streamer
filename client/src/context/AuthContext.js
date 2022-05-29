import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

axios.defaults.withCredentials = true;

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
  const [isLogged, setisLogged] = useState(false);
  const [change, setchange] = useState(false);
  //   const [isAdmin, setisAdmin] = useState(false);
  //   const [profileCompleted, setProfileCompleted] = useState(false);

  const update = () => setchange(!change);
  async function setInfo() {
    // const res = await getUserInfo();
    // setisLogged(res?.data.isLogged);
    // setisAdmin(res?.data.isAdmin);
    // setProfileCompleted(res?.data.profileCompleted);
  }
  useEffect(() => setInfo(), [change]);

  return (
    <AuthContext.Provider value={{ update, setisLogged }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
