export const useGetUserInfo = () => {
  const result = JSON.parse(localStorage.getItem("auth"));
  return {
    userId: result?.userId || "",
    name: result?.name || "",
    profilePhoto: result?.profilePhoto || "",
    isAuth: result?.isAuth || false,
  };
};
