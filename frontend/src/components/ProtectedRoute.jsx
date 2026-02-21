import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RouteIndex  } from "@/helper/RouteName";

function ProtectedRoute({ element }) {
  const { isLoggedIn } = useSelector((state) => state.user);

  if (!isLoggedIn) {
    return <Navigate to={RouteIndex} replace />;
  }

  return element;
}

export default ProtectedRoute;
