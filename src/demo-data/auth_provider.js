import React from "react";

const defaultUserState = {
  userId: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

const defaultAuthState = {
  token: "",
  user: defaultUserState,
  loginAt: new Date(),
  duration: 0,
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