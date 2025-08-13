import React from 'react'
import { Link } from 'react-router-dom';
import '../css/homePage.css' // improt  css for styling

// import youtube, subscribe and home icons from react-icons
import { SiYoutubeshorts } from "react-icons/si";
import { MdSubscriptions } from "react-icons/md";
import { IoMdHome } from "react-icons/io";

// Sidebar navigation component for main app navigation
function SideBar({ sidebarOpen }) {
    return (
        // Sidebar expands/collapses based on sidebarOpen prop
        <nav className={`sideBar${sidebarOpen ? '' : ' collapsed'}`}>
            <Link to="/" className="sideBar-item">
                <IoMdHome />
                <span className="sideBar-label">Home</span>
            </Link>
            <div className="sideBar-item">
                <SiYoutubeshorts />
                <span className="sideBar-label">Shorts</span>
            </div>
            <div className="sideBar-item">
                <MdSubscriptions />
                <span className="sideBar-label">Subscriptions</span>
            </div>
        </nav>
    )
}

export default SideBar // export Sidebar component
