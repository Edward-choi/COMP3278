import React from "react";

const defaultUserState = {
  user_id: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

const defaultAuthState = {
  token: "",
  user: defaultUserState,
  loginAt: new Date(),
  duration: parseInt(localStorage.getItem("duration") ?? "0"),
  stars: JSON.parse(localStorage.getItem("stars") || "[]"),
};

const authContext = React.createContext(defaultAuthState);
const dispatchContext = React.createContext(undefined);

export const AuthStateProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(
    (state, newValue) => ({ ...state, ...newValue }),
    defaultAuthState
  );
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
