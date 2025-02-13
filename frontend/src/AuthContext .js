// import React, { createContext, useState, useEffect, useContext } from 'react';

// // Create context for authentication
// const AuthContext = createContext();

// // AuthProvider component to wrap the entire app
// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isAdmin, setIsAdmin] = useState(false);

//   // Check if user is already authenticated when the app loads
//   useEffect(() => {
//     const savedAuthStatus = localStorage.getItem('isAuthenticated');
//     const savedAdminStatus = localStorage.getItem('isAdmin');
//     if (savedAuthStatus === 'true' && savedAdminStatus === 'true') {
//       setIsAuthenticated(true);
//       setIsAdmin(true);
//     }
//   }, []);

//   // Function to log in the admin
//   const login = () => {
//     setIsAuthenticated(true);
//     setIsAdmin(true);
//     localStorage.setItem('isAuthenticated', 'true');
//     localStorage.setItem('isAdmin', 'true');
//   };

//   // Function to log out
//   const logout = () => {
//     setIsAuthenticated(false);
//     setIsAdmin(false);
//     localStorage.removeItem('isAuthenticated');
//     localStorage.removeItem('isAdmin');
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook to use auth state
// export const useAuth = () => useContext(AuthContext);
