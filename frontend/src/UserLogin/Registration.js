import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

function Registration() {
  const apiUrl = process.env.REACT_APP_BASE_URL;
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const [username, setUsername] = useState("");
  const [userlastname, setUserlastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");
  const [step, setStep] = useState("registration");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0); 
  const [isResendDisabled, setIsResendDisabled] = useState(false); 

  const handleGoogleSuccess = async (response) => {
    try {
      const result = await axios.get(`${apiUrl}/user-log-reg/auth/google/callback`, {
        headers: { Authorization: `Bearer ${response.credential}` },
      });

      if (result.data.success) {
        localStorage.setItem("token", result.data.token);
        alert("Login successful!");
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



  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer); 
  }, [resendCooldown]);

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    setEmailError(""); 
  
    try {
      const response = await axios.post(`${apiUrl}/user-log-reg/registeruserdata`, {
        username,
        userlastname,
        email,
        password,
      });
  
      if (response.data.flag === 1) {
        alert("OTP sent to your email!");
        setUserId(response.data.data);
        setStep("otpVerification");
      } else {
        setEmailError(response.data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data.message) {
        setEmailError(error.response.data.message);
      } else {
        alert("Error registering user. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/user-log-reg/verifyotp`, {
        email,
        otp,
        userId,
        username,
        userlastname,
        password,
      });

      if (response.data.flag === 1) {
        alert("Registration successful!");
        window.location.href = "/login";
      } else {
        alert(response.data.message || "Invalid OTP.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please check your OTP or email.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (isResendDisabled) return; 
    setLoading(true);
    setIsResendDisabled(true);
    setResendCooldown(30); 

    try {
      const response = await axios.post(`${apiUrl}/user-log-reg/resendotp`, { email });

      if (response.data.flag === 1) {
        alert("A new OTP has been sent to your email!");
      } else {
        alert(response.data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error(error);
      alert("Error resending OTP. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="registration-form-container"
      onSubmit={step === "registration" ? handleRegister : handleVerifyOtp}
      method="POST"
    >
      <h2>{step === "registration" ? "Register" : "Verify OTP"}</h2>

      {step === "registration" && (
        <>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            placeholder="First Name"
            onChange={(e) => setUsername(e.target.value)}
            required
            className="reginput"
          />
          <input
            type="text"
            id="userlastname"
            name="userlastname"
            value={userlastname}
            placeholder="Last Name"
            onChange={(e) => setUserlastname(e.target.value)}
            required
            className="reginput"
          />
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="reginput"
          />
          {emailError && <p style={{ color: "red" }}>{emailError}</p>}
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="reginput"
          />
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          <label className="reginp">Show Password</label>

          <div className="mt-2 mb-3">
            <GoogleOAuthProvider clientId={googleClientId}>
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} />
            </GoogleOAuthProvider>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Register"}
          </button>
        </>
      )}

      {step === "otpVerification" && (
        <>
          <p>Enter the OTP sent to your email:</p>
          <input
            type="text"
            id="otp"
            name="otp"
            value={otp}
            placeholder="Enter OTP"
            onChange={(e) => setOtp(e.target.value)}
            required
            className="reginput"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Verify OTP"}
          </button>
          <br />
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={loading || isResendDisabled}
            style={{ marginTop: "10px" }}
          >
            {loading
              ? "Resending..."
              : resendCooldown > 0
              ? `Resend OTP (${resendCooldown}s)`
              : "Resend OTP"}
          </button>
          
        </>
      )}
      <p className="reglog"> You Don't Have Account <Link to="/login"> Login Here.. </Link> </p>
    </form>
  );
}

export default React.memo(Registration);
