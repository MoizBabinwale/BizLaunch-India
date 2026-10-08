export const handleUnauthorizedSession = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");

  if (window.location.pathname !== "/login") {
    window.location.replace("/login");
  }
};
