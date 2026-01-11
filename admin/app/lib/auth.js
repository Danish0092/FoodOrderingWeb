export const saveUser = (data) => {
  localStorage.setItem("token", data.accessToken);
  localStorage.setItem("user", JSON.stringify(data));
};

export const getUser = () => {
  if (typeof window === "undefined") return null;
  return JSON.parse(localStorage.getItem("user"));
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
