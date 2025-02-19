import React, { useState } from 'react';
import axios from 'axios';
import LeftSide from '../AdminComponent/LeftSide';
import NotifactionAdmin from '../AdminComponent/NotifactionAdmin';

const AdminPassword = () => {
    const apiUrl = process.env.REACT_APP_BASE_URL;
    const [showPassword, setShowPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    const user_id = sessionStorage.getItem('user_id');
    if (!user_id) {
      setMessage('Admin not logged in.');
      return;
    }
    try {
      const response = await axios.post(`${apiUrl}/updateadminpassword`, {
        user_id,
        currentPassword,
        newPassword,
        confirmPassword,
      });
      setMessage(response.data.msg);
    } catch (error) {
      setMessage(error.response?.data?.msg || 'Error updating password');
    }
  };

  return (
    <>
        <div className="bord">
            <LeftSide/>

            <section className="breadcrumb-option">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__text">
                                <h4> Admin Password </h4>
                                <div className="breadcrumb__links">
                                    <a href="/dashboard"> Dashboard </a>
                                    <span>Admin Password</span>
                                </div>
                            </div>
                        </div>
                        <NotifactionAdmin/>
                    </div>
                </div>
            </section>

            <div className="registration-form-container">
                <h2>Reset Admin Password</h2>

                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="reginput"
                />

                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="reginput"
                />

                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="reginput"
                />

                <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                />
                <label className="reginp">Show Password</label>

                {message && <p className={message === "Password updated successfully" ? "passsucces" : "errorpass"}>{message}</p>}

                <p className="forlink">
                    <a href="/forgotadminpass">Forgot Password?</a>
                </p>

                <button onClick={handlePasswordChange}>Update Password</button>

            </div>

        </div>
    </>
  );
};

export default React.memo(AdminPassword);
