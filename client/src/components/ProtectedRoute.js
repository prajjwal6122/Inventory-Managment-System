import { jwtDecode } from "jwt-decode";
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;

  try{
    const decoded=jwtDecode(token);
    if(decoded.exp*1000<Date.now()){
      localStorage.removeItem('token');
      return <Navigate to="/login"/>;
    }
  }
  catch(err){
    localStorage.removeItem('token');
      return <Navigate to="/login"/>;
  }

  return children;
}
