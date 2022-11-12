import { duration } from "@mui/material";
import React, { useEffect } from "react";

const defaultUserState = {
  user_id: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

const defaultAuthState = {
  token: JSON.parse(localStorage.getItem("state"))?.token ?? "",
  user: JSON.parse(localStorage.getItem("state"))?.user ?? defaultUserState,
  loginAt: JSON.parse(localStorage.getItem("state"))?.loginAt ?? Date.now(),
  duration: JSON.parse(localStorage.getItem("state"))?.duration ?? 0,
  stars: JSON.parse(localStorage.getItem("state"))?.stars ?? [],
};

const authContext = React.createContext(defaultAuthState);
const dispatchContext = React.createContext(undefined);

export const AuthStateProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(
    (state, newValue) => ({ ...state, ...newValue }),
    defaultAuthState
  );
  useEffect(() => {
    localStorage.setItem("state", JSON.stringify(state));
  }, [state]);
  return (
    <authContext.Provider value={state}>
      <dispatchContext.Provider value={dispatch}>
        {children}
      </dispatchContext.Provider>
    </authContext.Provider>
  );
};

export const useGlobalState = () => [
  React.useContext(authContext),
  React.useContext(dispatchContext),
];
