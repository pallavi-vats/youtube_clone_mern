import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx' // import logged in user
import '../css/userModal.css' // impotr css for styling

// import icons from react-icons
import { MdOutlineAccountCircle, MdOutlineSwitchAccount, MdLogout, MdOutlineSettings, MdOutlineLanguage, MdOutlineLocationOn } from "react-icons/md";
import { FiChevronRight } from "react-icons/fi";
import { BsMoon, BsSun } from "react-icons/bs";
import { FaRegKeyboard } from "react-icons/fa";

// User modal for account actions and settings
function UserModal({ onClose, setShowModal }) {
    const { user, setUser } = useAuth(); // get loggen in user from useAuth hook
    const navigate = useNavigate(); // get navigate from useNavigate hook

    // Go to user's channel page
    const handleViewChannel = () => {
        navigate("/channel"); // navigate to channel page (route)
        setShowModal(false); // hide modal after navigating
    };
    // Go to create channel page
    const handleCreateChannel = () => {
        navigate("/createChannel"); // navigate to createChannel route
        setShowModal(false); 
    };
    // Sign out logic
    const handleSignOut = () => {
        localStorage.removeItem('user'); // remove user from local storage
        setShowModal(false);
        setUser(null); // set user to null (logout) from user state (context) 
    };

    return (
        // Overlay closes modal on click outside
        <div className="user-modal-overlay" onClick={onClose}>
            <div className="user-modal" onClick={e => e.stopPropagation()}>
                <div className="user-modal-header">

                    {/* show user avatar, username, etc */}
                    <img src={user.avatar} alt={user.username} className="user-modal-avatar" />
                    <div className="user-modal-info">
                        <div className="user-modal-username">{user.username}</div>
                        <div className="user-modal-userid">@{user._id?.toLowerCase().replace(/\s/g, '') || 'user'}</div>
                        {user.channelId ? (

                            // if channel exists, show "view channel", else "Create Channel"
                            <span className="user-modal-link" onClick={handleViewChannel}>View your channel</span>
                        ) : (
                            <span className="user-modal-link" onClick={handleCreateChannel}>Create your channel</span>
                        )}
                    </div>
                </div>
                <div className="user-modal-divider"></div>
                <div className="user-modal-list">
                    <div className="user-modal-listitem">
                        <MdOutlineAccountCircle className="user-modal-icon" />
                        Google Account
                    </div>
                    <div className="user-modal-listitem user-modal-listitem-arrow">
                        <MdOutlineSwitchAccount className="user-modal-icon" />
                        Switch account
                        <FiChevronRight className="user-modal-arrow" />
                    </div>

                    {/* functioning logout button */}
                    <div className="user-modal-listitem" onClick={handleSignOut}>
                        <MdLogout className="user-modal-icon" />
                        Sign out
                    </div>
                </div>

                {/* static options for aesthetic */}
                <div className="user-modal-divider"></div>
                <div className="user-modal-list">
                    <div className="user-modal-listitem">
                        <MdOutlineSettings className="user-modal-icon" />
                        YouTube Studio
                    </div>
                    <div className="user-modal-listitem">
                        <MdOutlineSettings className="user-modal-icon" />
                        Purchases and memberships
                    </div>
                </div>
                <div className="user-modal-divider"></div>
                <div className="user-modal-list">
                    <div className="user-modal-listitem">
                        <MdOutlineSettings className="user-modal-icon" />
                        Your data in YouTube
                    </div>
                    <div className="user-modal-listitem user-modal-listitem-arrow">
                        <BsSun className="user-modal-icon" />
                        Appearance: Light
                        <FiChevronRight className="user-modal-arrow" />
                    </div>
                    <div className="user-modal-listitem user-modal-listitem-arrow">
                        <MdOutlineLanguage className="user-modal-icon" />
                        Language: English
                        <FiChevronRight className="user-modal-arrow" />
                    </div>
                    <div className="user-modal-listitem">
                        <MdOutlineSettings className="user-modal-icon" />
                        Restricted Mode: Off
                    </div>
                    <div className="user-modal-listitem">
                        <MdOutlineLocationOn className="user-modal-icon" />
                        Location: India
                    </div>
                    <div className="user-modal-listitem">
                        <FaRegKeyboard className="user-modal-icon" />
                        Keyboard shortcuts
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserModal // export user modal component