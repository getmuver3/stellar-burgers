import { getIsAuthChecked, getUser } from "@/services/slices/userSlice";
import { Preloader } from "@krgaa/react-developer-burger-ui-components";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

type TProtectedRouteProps = {
  children: React.ReactElement;
  onlyUnAuth?: boolean;
}

export const ProtectedRoute = ({ children, onlyUnAuth }: TProtectedRouteProps) => {
  const isAuthChecked = useSelector(getIsAuthChecked)
  const user = useSelector(getUser)
  const location = useLocation();
  
  if (!isAuthChecked) {
    return <Preloader />
  }

  if (!onlyUnAuth && !user) { 
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {  
    return <Navigate replace to="/" />;
  }

  return children
}