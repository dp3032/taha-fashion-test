import React, { useState } from 'react';
import axios from 'axios';
import Header from '../component/Header';
import Footer from '../component/Footer';

const ForgotPassword = () => {
    const apiUrl = process.env.REACT_APP_BASE_URL;
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Removed unused isSuccess

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
            await axios.post(`${apiUrl}/forgotpassword`, { email }); // Removed unused response
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
            <Header />
            <div className="registration-form-container mb-5">
                <h2>Forgot Password</h2>
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
            <Footer />
        </>
    );
};

export default React.memo(ForgotPassword);
