import { Navigate, Outlet, useLocation } from "react-router";
import { getSavedSession } from "../db/auth";

function PageAuthorization() {
  const location = useLocation();
  const session = getSavedSession();

  if (!session) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default PageAuthorization;
