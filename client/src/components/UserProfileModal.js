import React, { useState } from 'react'
import { RiCloseLine } from "react-icons/ri"

const UserProfileModal = ({ userName, email, setShowProfile }) => {
    const [updatedPassword, setUpdatedPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState('')

    const handlePasswordUpdate = () => {
        if (passwordError || confirmPasswordError) {
            return;
        }

    }

    return (
        <>
            <div className="profile-modal-outside-container" onClick={() => setShowProfile(false)} />
            <div className="profile-modal">
                <div className="profile-modal-header">
                    <button className="profile-modal-close-icon" onClick={() => setShowProfile(false)}>
                        <RiCloseLine />
                    </button>
                </div>
                <div className="profile-modal-form">
                    <div className="username">
                        <span>Username: </span> {userName}
                    </div>
                    <div className="email">
                        <span>Email: </span> {email}
                    </div>
                    <div className="change-password">
                        <span>Change Password: </span>
                        <input type="password" value={updatedPassword} onChange={(e) => {
                            setUpdatedPassword(e.target.value);
                            if (e.target.value.length !== 0 && e.target.value.length < 8) {
                                setPasswordError('The password must be 8 characters or longer')
                            }
                            else {
                                setPasswordError('')
                            }
                        }} />
                    </div>
                    <label
                        className="errorLabel"
                        style={{
                            display: passwordError ? 'block' : 'none',
                        }}
                    >
                        {passwordError}
                    </label>
                    <div className="confirm-password">
                        <span>Confirm Password: </span>
                        <input type="password" value={confirmPassword} onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (updatedPassword !== '' && e.target.value !== updatedPassword) {
                                setConfirmPasswordError('Confirm password should match New password')
                            }
                            else {
                                setConfirmPasswordError('')
                            }
                        }} />
                    </div>
                    <label
                        className="errorLabel"
                        style={{
                            display: confirmPasswordError ? 'block' : 'none',
                        }}
                    >
                        {confirmPasswordError}
                    </label>
                </div>
                <div className="profile-modal-buttons">
                    <button className="save-changes" onClick={() => handlePasswordUpdate()}>Save</button>
                    <button className="cancel-changes" onClick={() => setShowProfile(false)}>Cancel</button>
                </div>
            </div>
        </>
    )
}

export default UserProfileModal