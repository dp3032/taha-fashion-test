import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ResetAdminPass = () => {
    const apiUrl = process.env.REACT_APP_BASE_URL;
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleResetPassword = async () => {
        if (!password || !confirmPassword) {
            setMessage('Both fields are required.');
            return;
        }
        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        try {
            setIsLoading(true); // Show loading spinner
            const response = await axios.post(`${apiUrl}/resetpassword-admin/${token}`, {
                password,
                confirmPassword,
            });
            setIsSuccess(true);
            alert("Password successfully updated");
            setMessage(response.data.msg); 
        } catch (error) {
            setMessage(
                error.response?.data?.msg || 'An error occurred while resetting the password.'
            );
        } finally {
            setIsLoading(false); 
        }
    };

    return (
        <div className="registration-form-container">
            <h2>Reset Admin Password</h2>

            <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="reginput"
            />

            <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="reginput"
            />
                <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)} />
                    <label className="reginp">  
                        Show Password
                    </label>

            <button onClick={handleResetPassword} disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Reset Password'}
            </button>

            {message && (
                <p className={isSuccess ? 'success-message' : 'error-message'}>{message}</p>
            )}
        </div>
    );
};

export default React.memo(ResetAdminPass);
