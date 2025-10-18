import { createContext, useEffect, useMemo, useState } from "react";
import homeApi from "../../../apis/home";

// eslint-disable-next-line react-refresh/only-export-components
export const ContextTypes = {
  Home: "SET_HOME",
  HomeLoading: "SET_HOME_LOADING",
  HomeError: "SET_HOME_ERROR",
};

const initialState = {
  Home: {},
  HomeLoading: true,
  HomeError: null,
  dispatch: (type, payload) => {},
};
// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext(initialState);

export const UserProvider = ({ children }) => {
  const [Home, setHome] = useState(initialState.Home);
  const [HomeLoading, setHomeLoading] = useState(true);
  const [HomeError, setHomeError] = useState(null);

  const dispatch = (type, payload) => {
    switch (type) {
      case ContextTypes.Home:
        setHome(payload);
        break;
      case ContextTypes.HomeLoading:
        setHomeLoading(payload);
        break;
      case ContextTypes.HomeError:
        setHomeError(payload);
        break;
      default:
        return;
    }
  };

  useEffect(() => {
    setHomeLoading(true);
    homeApi
      .getHome()
      .then((res) => {
        setHome(res.data);
        setHomeError(null);
      })
      .catch((err) => {
        setHomeError(
          err.message || err.response.data.message || "Something went wrong"
        );
      })
      .finally(() => {
        setHomeLoading(false);
      });
  }, []);

  const value = useMemo(
    () => ({ Home, HomeLoading, HomeError, dispatch }),
    [Home, HomeLoading, HomeError]
  );

  console.log(Home);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
