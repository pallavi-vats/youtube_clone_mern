import React, { useState } from 'react'
import '../css/createChannel.css' // import css for styling
import axios from 'axios' // import axios for api calling
import { useAuth } from '../contexts/AuthContext.jsx' // import useAuth hook for Logged in User
import { useNavigate } from 'react-router-dom'

// component to create a channel
function CreateChannel() {

    // make a state to store the values from input to make a controlled input
    const [form, setForm] = useState({
        channelName: '',
        description: '',
        channelPic: '',
        channelBanner: ''
    });
    const { user, setUser } = useAuth(); // fetch logged in User
    const navigate = useNavigate(); // define navigate hook
    const [loading, setLoading] = useState(false); // loading state for component

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value }); // handle changes in input fields
    };

    const handleSubmit = async e => {
        e.preventDefault(); // prevent page from reloading

        // if user is not logged in, return an alert to login first
        if (!user) {
            alert("You must be logged in to create a channel.");
            return;
        }

        // Trim all fields ( validation )
        const trimmed = {
            channelName: form.channelName.trim(),
            description: form.description.trim(),
            channelPic: form.channelPic.trim(),
            channelBanner: form.channelBanner.trim()
        };

        // Check if required fields still have data after remove white spaces
        if (!trimmed.channelName) {
            alert("Channel name is required.");
            return;
        }
        setLoading(true); // set loading as true before submitting the form through API
        try { // try and catch block for clean code and error handling
            const { data } = await axios.post(
                "http://localhost:5100/api/channel",
                trimmed,

                // send header with JWT token along with the request (We are using 'Bearer' for best practices)
                { headers: { Authorization: `Bearer ${user.token}` } }
            );

            // Update user context (setUser) with new channelId
            setUser({ ...user, channelId: data.channelId || data._id });
            alert("Channel created!"); // send an alert that channel is created
            navigate("/channel"); // navigate to the newly created channel

        } catch (err) {

            // if any error is caught, send an alert to user
            alert("Failed to create channel: " + (err.response?.data?.message || err.message));

        } finally {
            setLoading(false); // finally set the loading to false
        }
    };

    return (
        <div className="create-channel-modal-bg">
            <div className="create-channel-modal">
                <h2 className="create-channel-title">How you'll appear</h2>

                {/* form starts */}
                <form className="create-channel-form" onSubmit={handleSubmit}>
                    <div className="create-channel-avatar-section">
                        {/* if no channelPic is provided then, use placeholder image by default */}
                        <img
                            src={form.channelPic || "https://placehold.co/50.png?text=You"}
                            alt="Channel avatar"
                            className="create-channel-avatar"
                        />
                        <input
                            type="url"
                            name="channelPic"
                            placeholder="Channel picture URL"
                            value={form.channelPic}
                            onChange={handleChange}
                            className="create-channel-input"
                            style={{ marginTop: "0.7rem" }}
                        />
                    </div>
                    <div className="create-channel-fields">
                        <label className="create-channel-label">Name</label>
                        <input
                            className="create-channel-input"
                            name="channelName"
                            type="text"
                            placeholder="Channel name"
                            value={form.channelName}
                            onChange={handleChange}
                            required
                            autoFocus
                        />
                        <label className="create-channel-label">Description</label>
                        <textarea
                            className="create-channel-input"
                            name="description"
                            placeholder="Channel description"
                            value={form.description}
                            onChange={handleChange}
                            rows={2} // bigger row for channel description
                        />
                        <label className="create-channel-label">Banner URL (optional)</label>
                        <input
                            className="create-channel-input"
                            name="channelBanner"
                            type="url"
                            placeholder="Channel banner URL"
                            value={form.channelBanner}
                            onChange={handleChange}
                            // no required attribute for banner (banner is optional)
                        />
                    </div>
                    <div className="create-channel-actions">
                        <button
                            type="button"
                            className="create-channel-cancel"
                            onClick={() => window.history.back()} // if cancelled go back to window history
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="create-channel-submit"
                            disabled={!form.channelName || loading}
                        >
                            {/* if loading, show loading..., else show create channel button */}
                            {loading ? "Creating..." : "Create channel"}
                        </button>
                    </div>
                    <div className="create-channel-terms">
                        {/* terms and conditions to mimic youtube policies */}
                        By clicking Create Channel you agree to <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer">YouTube's Terms of Service</a>.
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateChannel; // export create channel component