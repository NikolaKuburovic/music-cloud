import React, {useState} from "react";
import projectTheme from "../../projectTheme";
import Registracija from "./Registracija";
import Prijava from "./Prijava";

export default projectTheme(() => {
  const [newUser, setNewUser] = useState(true)
  return newUser ? (
  <Registracija setNewUser={setNewUser}/>
  ) : (
    <Prijava setNewUser={setNewUser}/>
  )
});
