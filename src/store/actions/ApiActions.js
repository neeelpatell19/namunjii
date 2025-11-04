export const ApiActions = {
  UserData: "API/USER_DATA",
};

export const updateUserData = (value) => {
  return { type: ApiActions.UserData, value };
};
