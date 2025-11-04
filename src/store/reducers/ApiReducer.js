import { ApiActions } from "../actions/ApiActions";

const initialState = {
  userData: null,
};

const apiReducer = (state = initialState, action) => {
  switch (action.type) {
    case ApiActions.UserData:
      return { ...state, userData: action.value };
    default:
      return state;
  }
};

export default apiReducer;
