import React, { useState, useEffect } from 'react';
import axios from 'axios'; // import axios for API callings
import Video from './Video.jsx'; // import video card component to call in every insatnce of video.map()
import '../css/homePage.css'; // import css for styling
import { useOutletContext } from 'react-router-dom'; // import outlet context for getting search inputs (from Header component)

// VideoList component: shows all videos, handles search and category filter
function VideoList({ sidebarOpen }) {

    // categories to filter on
    const categories = ["All", "Programming", "Tech", "Design", "AI", "Gaming", "Vlogs", "Music", "Education"];
    const [videos, setVideos] = useState([]); // state for videos to get saved in after fetching from API
    const [selectedCategory, setSelectedCategory] = useState("All"); // default category set to ALL

    // get values from outlet context (passed in outlet of app.jsx (common parent of header and videoList)
    const {
        searchedVal,
        setSearchedVal,
        searchActive,
        setSearchActive
    } = useOutletContext();

    // Fetch all videos on mount (use effect for API calling)
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const { data } = await axios.get("http://localhost:5100/api/videos");
                setVideos(data); // set fetched data in videos state
            } catch (err) {
                console.error("Failed to load videos:", err); // send error in console if anything goes wrong
            }
        };
        fetchVideos();
    }, []);

    // Handle category click: clear search and deactivate search
    const handleCategoryClick = (cat) => {
        setSelectedCategory(cat);
        setSearchedVal(""); // remove any search inputs when filter by category is applies to avoid conflicts
        setSearchActive(false); // turn off searchActive state
    };

    // Filter videos by search or category
    let filteredVideos = videos;

    // if searched value is not white spaces then filter videos on that value
    if (searchActive && searchedVal.trim()) {
        filteredVideos = videos.filter(v =>
            v.title?.toLowerCase().includes(searchedVal.trim().toLowerCase())
        );
    } else if (selectedCategory !== "All") {
        
        // else if category is not All then filter videos on the selected category
        filteredVideos = videos.filter(v =>
            v.category?.toLowerCase() === selectedCategory.toLowerCase()
        );
    }

    // If search is active, always show "All" as selected (to avoid conflicts)
    const effectiveCategory = searchActive ? "All" : selectedCategory;

    return (
        <div className='home-page'>
            {/* Category filter bar */}
            <div className='filter-options'>
                {categories.map(cat => (
                    <button
                        key={cat}

                        // conditional class name for CSS
                        className={`filter-btn${effectiveCategory === cat ? ' active' : ''}`}
                        onClick={() => handleCategoryClick(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Video grid */}
            <div className='videoList'>
                {filteredVideos.map((video) => (
                    <Video {...video} key={video._id} />
                ))}
            </div>
        </div>
    );
}

export default VideoList; // export videoList
