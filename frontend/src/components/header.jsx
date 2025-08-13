import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'; // import logged in user from context
import UserModal from './UserModal.jsx' // import userModal to be called from Header
import axios from 'axios'; // import axios for calling APIs
import '../css/homePage.css' // import css for styling
import '../css/registerLogin.css'
import '../css/createChannel.css'

// import hamburger, youtube, search, upload, bell, like, dislike, icons from react-icons library
import { RxHamburgerMenu } from "react-icons/rx";
import { FaYoutube } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { FaBell, FaUser } from "react-icons/fa";
import { RiVideoUploadLine } from "react-icons/ri";

// component for Header. Get 'search state' and 'sidebar state' from props
function Header({ sidebarOpen, setSidebarOpen, searchedVal, setSearchedVal, onSearch }) {
    const { user, setUser } = useAuth(); // get user from global context
    const navigate = useNavigate(); // get useNavigate hook from react-router-dom
    const [showModal, setShowModal] = useState(false); // create state to show and hide modal based on boolean value
    const [showUpload, setShowUpload] = useState(false); // state to show and hide upload button

    // state for input values of upload form (controlled input)
    const [form, setForm] = useState({
        title: '',
        videoLink: '',
        thumbnail: '',
        description: '',
        category: ''
    });
    const [formLoading, setFormLoading] = useState(false); // form loading false by default

    // when search input gets values, set it in search state (defined in app.jsx)
    function handleSearchInput(e) {
        setSearchedVal(e.target.value);
    }

    // when search button is clicked call search() (declared in parent comp ie, app.jsx)
    function handleSearchBtn(e) {
        e.preventDefault(); // prevent form page reload
        if (onSearch) onSearch(); // Best Practice to check function before calling it
    }

    // Open upload modal (form)
    const handleUpload = () => {
        setForm(initialForm); // set intial values in form
        setShowUpload(true); // set show modal to true
    };

    // Upload video logic (same as YourChannel)
    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        // Trim all fields
        const trimmed = {
            title: form.title.trim(),
            videoLink: form.videoLink.trim(),
            thumbnail: form.thumbnail.trim(),
            description: form.description.trim(),
            category: form.category.trim()
        };
        // Check required fields
        if (!trimmed.title || !trimmed.videoLink || !trimmed.thumbnail) {
            alert("Please fill in all required fields.");
            setFormLoading(false);
            return;
        }
        try {
            // user is available from context
            await axios.post( // send post request to API for uploadig new video
                "http://localhost:5100/api/video",
                trimmed,

                // send JWT token in header
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            alert("Video uploaded!"); // send alert that video is uploaded
            setShowUpload(false); // hide upload form

            // empty the input fields
            setForm({
                title: '',
                videoLink: '',
                thumbnail: '',
                description: '',
                category: ''
            });

        } catch (err) {

            // send alert if anything goes wrong
            alert("Failed to upload video: " + (err.response?.data?.message || err.message));

        } finally {
            setFormLoading(false); // finally set form loading to false
        }
    };

    return (
        <>
            {/* Upload Modal (form) */}
            {showUpload && (
                <div className="create-channel-modal-bg" style={{ zIndex: 3000 }}>
                    <div className="create-channel-modal" style={{ maxWidth: 500 }}>
                        <h2 className="create-channel-title">Upload Video</h2>

                        {/* form starts */}
                        <form className="create-channel-form" onSubmit={handleUploadSubmit}>
                            <div className="create-channel-fields">
                                <label className="create-channel-label">Title</label>
                                <input
                                    className="create-channel-input"
                                    name="title"
                                    type="text"
                                    placeholder="Video title"
                                    value={form.title}

                                    // onChange update the controlled input states
                                    onChange={e => setForm({ ...form, title: e.target.value })}
                                    required
                                    autoFocus
                                />
                                <label className="create-channel-label">Video Link (URL)</label>
                                <input
                                    className="create-channel-input"
                                    name="videoLink"
                                    type="url"
                                    placeholder="Video file URL"
                                    value={form.videoLink}
                                    onChange={e => setForm({ ...form, videoLink: e.target.value })}
                                    required
                                />
                                <label className="create-channel-label">Thumbnail URL</label>
                                <input
                                    className="create-channel-input"
                                    name="thumbnail"
                                    type="url"
                                    placeholder="Thumbnail image URL"
                                    value={form.thumbnail}
                                    onChange={e => setForm({ ...form, thumbnail: e.target.value })}
                                    required
                                />
                                <label className="create-channel-label">Description</label>
                                <textarea
                                    className="create-channel-input"
                                    name="description"
                                    placeholder="Video description"
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    rows={2} // bigger row for description
                                />
                                <label className="create-channel-label">Category</label>
                                <input
                                    className="create-channel-input"
                                    name="category"
                                    type="text"
                                    placeholder="Category"
                                    value={form.category}
                                    onChange={e => setForm({ ...form, category: e.target.value })}
                                />
                            </div>
                            <div className="create-channel-actions">
                                <button
                                    type="button"
                                    className="create-channel-cancel"
                                    onClick={() => setShowUpload(false)}
                                    disabled={formLoading} // disable button when form is loading
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="create-channel-submit"

                                    // disable submit button when formLoading, OR required fields are empty
                                    disabled={!form.title || !form.videoLink || !form.thumbnail || formLoading}
                                >
                                    {/* if form is loading, show uploading..., else show upload */}
                                    {formLoading ? "Uploading..." : "Upload"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <header className='header'>
                <div className='left'>

                    {/* on clicking hamburger icon, expand sidebar */}
                    <span onClick={() => setSidebarOpen(!sidebarOpen)} style={{cursor: 'pointer'}}>
                        <RxHamburgerMenu />
                    </span>
                    <Link to="/" className='youtube'>
                        <FaYoutube className="fa-youtube" /> {/* youtube icon links to homepage */}
                        <h2>YouTube</h2>
                    </Link>
                </div>
                <div className='mid'>

                    {/* search input and search button with eventListeners */}
                    <input placeholder="Search" onChange={handleSearchInput} value={searchedVal} />
                    <button onClick={handleSearchBtn}><CiSearch /></button>
                </div>
                <div className='right'>
                    {
                        // if user channel exists, show uploading button
                        user?.channelId &&
                        <RiVideoUploadLine onClick={() => setShowUpload(true)} />
                    }
                    {user && <FaBell />}

                    {/* if user loggedIn, show userIcon, else show SignIn and SignUp buttons */}
                    {user ? (
                        <>
                            <img
                                src={user.avatar}
                                alt="User"
                                className="header-avatar"
                                onClick={() => setShowModal(v => !v)} // on clicking icon, show userModal
                                style={{ cursor: 'pointer', borderRadius: '50%' }}
                            />

                            {/* toggle logic for showing and hiding user modal */}
                            {showModal && <UserModal setShowModal={setShowModal} onClose={() => setShowModal(false)} />}
                        </>
                        ) : (
                        <>
                            <Link to="/login" className="header-auth-link">Log-in</Link>
                            <Link to="/register" className="header-auth-link signup">Register</Link>
                        </>
                    )}
                </div>
            </header>
        </>
    )
}

export default Header; // export header component
