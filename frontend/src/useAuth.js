import { useEffect } from "react";

const useAuth = () => {

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const tokenExpiry = sessionStorage.getItem("token_expiry");

    if (token && tokenExpiry) {
      const currentTime = Math.floor(Date.now() / 1000); 

      // If the token has expired
      if (currentTime >= tokenExpiry) {
        sessionStorage.clear();
        alert("Session expired. Please login again.");
        window.location.href="/login"; 
      }
    }
  }, []); 

};

export default useAuth;
