import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

function Login() {
  const apiUrl = process.env.REACT_APP_BASE_URL;
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const [loginemail, Setloginemail] = useState("");
  const [loginpassword, Setloginpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginuser = (event) => {
    event.preventDefault();

    axios.post(`${apiUrl}/user-log-reg/loginuserdata`, { loginemail, loginpassword })
      .then((res) => {
        if (res.data.flag === 1) {
          const token = res.data.token;
          

          const decodedToken = jwtDecode(token);
          sessionStorage.setItem("token_expiry", decodedToken.exp);

          if (res.data.role === "admin") {
            alert("Login successful! Hello Admin.");
              sessionStorage.setItem("token", token);
              sessionStorage.setItem("user_id", res.data.user_id);
              sessionStorage.setItem("role", res.data.role);
              window.location.href = "/dashboard";
          } else {
            alert("Login successful!");
              sessionStorage.setItem("token", token);
              sessionStorage.setItem("is_user_login", true);
              sessionStorage.setItem("role", res.data.role);
              sessionStorage.setItem("user_id", res.data.user_id);
              sessionStorage.setItem("name", res.data.name);
            window.location.href = "/";
          }
        } else {
          alert("Invalid email or password.");
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Network Error...!");
      });
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const res = await axios.post(`${apiUrl}/auth/google/success`, {
        tokenId: response.credential, // Send Google token
      });
  
      if (res.data.success) {
        sessionStorage.setItem("token", res.data.token);
        sessionStorage.setItem("user_id", res.data.user_id);
        alert("Google Login successful!");
        window.location.href = "/";
      } else {
        alert("Google authentication failed");
      }
    } catch (error) {
      console.error("Google Login Error", error);
      alert("Error logging in with Google");
    }
  };
  
  const handleGoogleFailure = (error) => {
    console.error("Google Login Failed:", error);
  };

  return (
    <form className="registration-form-container" onSubmit={loginuser}>
      <h2>Login</h2>

        <input type="email" id="email" name="email" placeholder="Email"
          onChange={(e) => Setloginemail(e.target.value)}
          required
          className="reginput"
        />

        <input type={showPassword ? 'text' : 'password'} id="password" name="password"
          placeholder="Password"
          onChange={(e) => Setloginpassword(e.target.value)}
          required
          className="reginput"
        />

        <input type="checkbox" 
          checked={showPassword} 
          onChange={() => setShowPassword(!showPassword)}
        />

        <label className="reginp">Show Password</label>

        <p className="forlink">
          <a href="/forgotpassword">Forgot Password?</a>
        </p>
        
        <div className="mt-2 mb-3">
          <GoogleOAuthProvider clientId={googleClientId}>
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} />
          </GoogleOAuthProvider>
        </div>

        <button type="submit">Login</button>

        <p className="reglog">
          You don't have an account? <Link to="/registration">Register here</Link>
        </p>

    </form>
  );
}

export default React.memo(Login);
