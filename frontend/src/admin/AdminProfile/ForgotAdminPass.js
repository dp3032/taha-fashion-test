import React, { useState } from 'react';
import axios from 'axios';
import LeftSide from '../AdminComponent/LeftSide';
import NotifactionAdmin from '../AdminComponent/NotifactionAdmin';

const ForgotAdminPass = () => {
    const apiUrl = process.env.REACT_APP_BASE_URL;
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleForgotPassword = async () => {
        if (!email) {
            setMessage('Please enter your email.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setMessage('Please enter a valid email address.');
            return;
        }

        try {
            setIsLoading(true);
            await axios.post(`${apiUrl}/forgotpassword-admin`, { email }); 
            setMessage('Reset password link has been sent to your email address');
        } catch (error) {
            setMessage(
                error.response?.data?.msg || 'An error occurred while sending the reset link.'
            );
        } finally {
            setIsLoading(false);
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
                                    <a href="/adminpassword"> Admin Password </a>
                                    <span>Forgot Admin Password</span>
                                </div>
                            </div>
                        </div>
                        <NotifactionAdmin/>
                    </div>
                </div>
            </section>

            <div className="registration-form-container mb-5">
                <h2>Forgot Admin Password</h2>
                <input
                    type="email"
                    id="email"
                    placeholder="Enter your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="reginput"
                />
                <button onClick={handleForgotPassword} disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Send Reset Link'}
                </button>
                {message && (
                    <p
                        className={
                            message === 'Reset password link has been sent to your email address'
                                ? 'success-messagee'
                                : 'error-messagee'
                        }
                    >
                        {message}
                    </p>
                )}
            </div>

        </div>
        </>
    );
};

export default React.memo(ForgotAdminPass);
