import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx'; // import header component
import SideBar from './components/SideBar.jsx'; // import sidebar component
import { Outlet } from 'react-router-dom'; // import outlet
import './App.css'; // import css for styling

// Main App layout: handles sidebar, header, and main content routing
function App() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchedVal, setSearchedVal] = useState("");
    const [searchActive, setSearchActive] = useState(false);
    // State to keep track of the window width
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Effect to handle window resize and update windowWidth state
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); // Empty dependency array ensures this effect runs once on mount and cleans up on unmount

    // Determine if the screen width is less than or equal to 792px
    const isMobile = windowWidth <= 792;

    // Calculate left margin based on sidebar state and screen width
    const mainContentStyle = {
        // If it's mobile, set marginLeft to 0, otherwise use sidebarOpen logic
        marginLeft: isMobile ? 0 : (sidebarOpen ? 220 : 72),
        // If it's mobile, set transition to 'none', otherwise use original transition
        transition: isMobile ? 'none' : 'margin-left 0.2s cubic-bezier(.4,0,.2,1)'
    };

    // Called when search button is clicked
    const handleSearch = () => {
        setSearchActive(true);
    };

    return (
        <>
            {/* Header and sidebar */}
            <Header
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                searchedVal={searchedVal}
                setSearchedVal={setSearchedVal}
                onSearch={handleSearch}
            />
            <div className="app-layout">
                {/* Sidebar and main content */}
                <SideBar sidebarOpen={sidebarOpen} isMobile={isMobile} />
                <div className="main-content" style={mainContentStyle}>
                    {/* Outlet for nested routes */}
                    <Outlet context={{
                        sidebarOpen,
                        searchedVal,
                        setSearchedVal,
                        searchActive,
                        setSearchActive
                    }} />
                </div>
            </div>
        </>
    );
}

export default App; // export app