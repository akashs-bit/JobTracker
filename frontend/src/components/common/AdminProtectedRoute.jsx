import { Navigate, Outlet, useLocation } from "react-router-dom";

const AdminProtectedRoute = () => {
  const location = useLocation();

  const isLoggedIn =
    localStorage.getItem("jobtracker_logged_in") === "true";

  const user = JSON.parse(
    localStorage.getItem("jobtracker_user") || "null"
  );

  // Not logged in
  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // Logged in but not admin
  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;