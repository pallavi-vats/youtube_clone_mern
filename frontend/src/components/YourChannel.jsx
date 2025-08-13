import React, { useState, useEffect } from 'react'
import { Link, useOutletContext } from 'react-router-dom' // import outlet context for getting sideBar
import axios from 'axios'; // import axios for calling APIs
import '../css/channel.css' // import css for styling
import { useAuth } from '../contexts/AuthContext.jsx'; // import authContext for 'Logged-in User'

// import icons from react-icons
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdEdit, MdDelete, MdUpload, MdSave, MdClose } from "react-icons/md";

// Main component for managing your own channel (videos, edit, upload)
function YourChannel() {
  const { sidebarOpen } = useOutletContext();
  const { user } = useAuth(); // get loggen in user from context
  const [channel, setChannel] = useState(null); // channel set to null by default
  const [videos, setVideos] = useState([]); // videos uploaded on channel set to empty by defalt
  const [menuOpen, setMenuOpen] = useState(null); // meatball menu for videos hidden initially
  const [descExpanded, setDescExpanded] = useState(false); // description is collapsed by default
  const [loading, setLoading] = useState(true); // loading is true by default
  const [error, setError] = useState(null); // error is null initially

  // Upload/edit modal state
  const [showUpload, setShowUpload] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editVideo, setEditVideo] = useState(null);

  // Upload/edit form state
  const initialForm = {
    title: '',
    videoLink: '',
    thumbnail: '',
    description: '',
    category: ''
  };
  const [form, setForm] = useState(initialForm);
  const [formLoading, setFormLoading] = useState(false);

  // Channel edit modal state
  const [showEditChannel, setShowEditChannel] = useState(false); // channel edit modal hidden by default
  const [channelEditForm, setChannelEditForm] = useState({
    channelName: "",
    channelBanner: "",
    channelPic: "",
    description: ""
  });
  const [channelEditLoading, setChannelEditLoading] = useState(false);

  // Fetch channel and videos on mount
  useEffect(() => {
        if (!user?.channelId) return;
        setLoading(true);
        setError(null);
        axios.get(`http://localhost:5100/api/channel/${user.channelId}`) // call API to get channels videos
            .then(res => {

                // set videos and channel into states
                setChannel(res.data);
                setVideos(res.data.videos || []);
            })
            .catch(err => {
                setError("Failed to load channel."); // if any error is caught
            })
            .finally(() => setLoading(false)); // finally set loading to false
    }, [user?.channelId]);


  // description logic for collapsing and expanding
  const descLimit = 180;
  const showMore = channel && channel.description && channel.description.length > descLimit;
  const descToShow = channel && channel.description
    ? (descExpanded ? channel.description : channel.description.slice(0, descLimit))
    : "";

  // API for deleting a video
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this video?")) return;
    try {
      await axios.delete(
        `http://localhost:5100/api/video/${id}`,
        { headers: { Authorization: `Bearer ${user.token}` } } // send JWT token in header
      );

      // re-filter the videos on frontend without the deleted video
      setVideos(videos => videos.filter(v => v._id !== id));
      setMenuOpen(null);
    } catch (err) {
      alert("Failed to delete video"); // alert if anything goes wrong
    }
  };

  // Open upload modal
  const handleUpload = () => {
    setForm(initialForm);
    setShowUpload(true);
  };

  // Open edit modal
  const handleEdit = (id) => {
    const video = videos.find(v => v._id === id);
    if (video) {
      setEditVideo(video);
      setForm({
        title: video.title || '',
        videoLink: video.videoLink || '',
        thumbnail: video.thumbnail || '',
        description: video.description || '',
        category: video.category || ''
      });
      setShowEdit(true);
    }
    setMenuOpen(null);
  };

  // Upload video
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    // Trim all fields (validation so empty fields can't be pushed into database)
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

    // API calling for uploading the video
    try {
      await axios.post(
        "http://localhost:5100/api/video",
        trimmed,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      // Refresh videos (get channel again with new video this time)
      const res = await axios.get(`http://localhost:5100/api/channel/${user.channelId}`);
      setChannel(res.data);
      setVideos(res.data.videos || []);
      setShowUpload(false);
      setForm(initialForm);
    } catch (err) {

      // send alert if video could not be uploaded
      alert("Failed to upload video: " + (err.response?.data?.message || err.message));
    } finally {
      setFormLoading(false);
    }
  };

  // Edit video logic
  const handleEditSubmit = async (e) => {
    e.preventDefault(); // stops page from reloading
    if (!editVideo) return;
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
      await axios.put(
        `http://localhost:5100/api/video/${editVideo._id}`, // API calling for editing videos
        trimmed,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      // Refresh videos after update
      const res = await axios.get(`http://localhost:5100/api/channel/${user.channelId}`);
      setChannel(res.data);
      setVideos(res.data.videos || []);
      setShowEdit(false);
      setEditVideo(null);
      setForm(initialForm);
    } catch (err) {
      alert("Failed to update video: " + (err.response?.data?.message || err.message));
    } finally {
      setFormLoading(false);
    }
  };

  // Prepare channel edit form when opening modal
  const openEditChannelModal = () => {
    setChannelEditForm({
      channelName: channel.channelName || "",
      channelBanner: channel.channelBanner || "",
      channelPic: channel.channelPic || "",
      description: channel.description || ""
    });
    setShowEditChannel(true);
  };

  // controlled input for channel edit form fields
  const handleChannelEditChange = e => {
    setChannelEditForm({ ...channelEditForm, [e.target.name]: e.target.value });
  };

  const handleChannelEditSave = async (e) => {
    e.preventDefault();
    setChannelEditLoading(true);
    // Trim all fields
    const trimmed = {
      channelName: channelEditForm.channelName.trim(),
      channelBanner: channelEditForm.channelBanner.trim(),
      channelPic: channelEditForm.channelPic.trim(),
      description: channelEditForm.description.trim()
    };
    // Check required fields
    if (!trimmed.channelName) {
      alert("Channel name is required.");
      setChannelEditLoading(false);
      return;
    }
    try {
      await axios.put( // put API for editing channel
        `http://localhost:5100/api/updateChannel/${channel._id}`,
        trimmed,
        { headers: { Authorization: `Bearer ${user.token}` } } // JWT sent in header
      );
      // Refresh channel data
      const res = await axios.get(`http://localhost:5100/api/channel/${user.channelId}`);
      setChannel(res.data);
      setShowEditChannel(false);
    } catch (err) {
      alert("Failed to update channel: " + (err.response?.data?.message || err.message));
    } finally {
      setChannelEditLoading(false);
    }
  };

  const handleFormChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (loading) return <div style={{ padding: 32 }}>Loading...</div>;
  if (error) return <div style={{ padding: 32, color: 'red' }}>{error}</div>;
  if (!channel) return null; // if channel does not exist, show nothing

  return (
    <div className="channel-page" style={{ flex: 1 }}>

      {/* Channel Edit Modal ------------------------------------------------- */}
      {showEditChannel && (
        <div className="edit-channel-modal-bg">
          <div className="edit-channel-modal">
            <h2 className="edit-channel-title">Edit Channel Details</h2>
            <form className="edit-channel-form" onSubmit={handleChannelEditSave}>
              <label className="edit-channel-label">Channel Name</label>
              <input
                className="edit-channel-input"
                name="channelName"
                type="text"
                placeholder="Channel name"
                value={channelEditForm.channelName}
                onChange={handleChannelEditChange}
                required
                autoFocus
              />
              <label className="edit-channel-label">Description</label>
              <textarea
                className="edit-channel-input"
                name="description"
                placeholder="Channel description"
                value={channelEditForm.description}
                onChange={handleChannelEditChange}
                rows={3}
              />
              <label className="edit-channel-label">Banner URL</label>
              <input
                className="edit-channel-input"
                name="channelBanner"
                type="url"
                placeholder="Banner image URL"
                value={channelEditForm.channelBanner}
                onChange={handleChannelEditChange}
              />
              <img
                src={channelEditForm.channelBanner || "https://placehold.co/600x150.png?text=Banner"}
                alt="Banner preview"
                className="edit-channel-banner-preview"
              />
              <label className="edit-channel-label">Channel Picture URL</label>
              <input
                className="edit-channel-input"
                name="channelPic"
                type="url"
                placeholder="Channel picture URL"
                value={channelEditForm.channelPic}
                onChange={handleChannelEditChange}
              />
              <img
                src={channelEditForm.channelPic || "https://placehold.co/100x100.png?text=channel"}
                alt="Avatar preview"
                className="edit-channel-avatar-preview"
              />
              <div className="edit-channel-actions">
                <button
                  type="button"
                  className="edit-channel-cancel"
                  onClick={() => setShowEditChannel(false)}
                  disabled={channelEditLoading}
                >
                  <MdClose style={{ marginRight: 6 }} />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="edit-channel-save"
                  disabled={channelEditLoading || !channelEditForm.channelName}
                >
                  <MdSave style={{ marginRight: 6 }} />
                  {channelEditLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Modal ------------------------------------------------- */}
      {showUpload && (
        <div className="create-channel-modal-bg" style={{ zIndex: 3000 }}>
          <div className="create-channel-modal" style={{ maxWidth: 500 }}>
            <h2 className="create-channel-title">Upload Video</h2>
            <form className="create-channel-form" onSubmit={handleUploadSubmit}>
              <div className="create-channel-fields">
                <label className="create-channel-label">Title</label>
                <input
                  className="create-channel-input"
                  name="title"
                  type="text"
                  placeholder="Video title"
                  value={form.title}
                  onChange={handleFormChange}
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
                  onChange={handleFormChange}
                  required
                />
                <label className="create-channel-label">Thumbnail URL</label>
                <input
                  className="create-channel-input"
                  name="thumbnail"
                  type="url"
                  placeholder="Thumbnail image URL"
                  value={form.thumbnail}
                  onChange={handleFormChange}
                  required
                />
                <label className="create-channel-label">Description</label>
                <textarea
                  className="create-channel-input"
                  name="description"
                  placeholder="Video description"
                  value={form.description}
                  onChange={handleFormChange}
                  rows={2}
                />
                <label className="create-channel-label">Category</label>
                <input
                  className="create-channel-input"
                  name="category"
                  type="text"
                  placeholder="Category"
                  value={form.category}
                  onChange={handleFormChange}
                />
              </div>
              <div className="create-channel-actions">
                <button
                  type="button"
                  className="create-channel-cancel"
                  onClick={() => setShowUpload(false)}
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="create-channel-submit"
                  disabled={!form.title || !form.videoLink || !form.thumbnail || formLoading}
                >
                  {formLoading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal --------------------------------------------------- */}
      {showEdit && (
        <div className="create-channel-modal-bg" style={{ zIndex: 3000 }}>
          <div className="create-channel-modal" style={{ maxWidth: 500 }}>
            <h2 className="create-channel-title">Edit Video</h2>
            <form className="create-channel-form" onSubmit={handleEditSubmit}>
              <div className="create-channel-fields">
                <label className="create-channel-label">Title</label>
                <input
                  className="create-channel-input"
                  name="title"
                  type="text"
                  placeholder="Video title"
                  value={form.title}
                  onChange={handleFormChange}
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
                  onChange={handleFormChange}
                  required
                />
                <label className="create-channel-label">Thumbnail URL</label>
                <input
                  className="create-channel-input"
                  name="thumbnail"
                  type="url"
                  placeholder="Thumbnail image URL"
                  value={form.thumbnail}
                  onChange={handleFormChange}
                  required
                />
                <label className="create-channel-label">Description</label>
                <textarea
                  className="create-channel-input"
                  name="description"
                  placeholder="Video description"
                  value={form.description}
                  onChange={handleFormChange}
                  rows={2}
                />
                <label className="create-channel-label">Category</label>
                <input
                  className="create-channel-input"
                  name="category"
                  type="text"
                  placeholder="Category"
                  value={form.category}
                  onChange={handleFormChange}
                />
              </div>
              <div className="create-channel-actions">
                <button
                  type="button"
                  className="create-channel-cancel"
                  onClick={() => { setShowEdit(false); setEditVideo(null); }}
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="create-channel-submit"
                  disabled={!form.title || !form.videoLink || !form.thumbnail || formLoading}
                >
                  {formLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* channel page actually starts here ----------------------------------------------- */}
      <div className="channel-banner-container">
        <img
          className="channel-banner"
          src={channel.channelBanner || "https://placehold.co/600x150.png?text=Banner"}
          alt="Channel banner"
        />
      </div>
      <div className="channel-header">
        <img className="channel-avatar" src={channel.channelPic || "https://placehold.co/100x100.png?text=channel"} alt={channel.channelName} />
        <div className="channel-info">
          <div className="channel-title">{channel.channelName}</div>
          <div className="channel-meta">
            <span className="channel-handle">@{channel.channelName?.toLowerCase().replace(/\s/g, '')}-ic4ou</span>
            <span className="channel-dot">·</span>
            <span className="channel-subs">{channel.subscribers} subscribers</span>
            <span className="channel-dot">·</span>
            <span className="channel-videos">{videos.length} videos</span>
          </div>
          <div className="channel-desc">
            {descToShow}
            {showMore && !descExpanded && (
              <span className="desc-more" onClick={() => setDescExpanded(true)}>...more</span>
            )}
            {showMore && descExpanded && (
              <span className="desc-less" onClick={() => setDescExpanded(false)}> Show less</span>
            )}
          </div>
          <div className="channel-actions">
            <button className="channel-btn" onClick={handleUpload}>
              <MdUpload style={{ marginRight: 6, fontSize: "1.2rem" }} />
              Upload video
            </button>
            <button className="channel-btn" onClick={openEditChannelModal}>
              Customize channel
            </button>
            <button className="channel-btn secondary">Manage videos</button>
          </div>
        </div>
      </div>
      <div className="channel-tabs">
        <div className="channel-tab">Home</div>
        <div className="channel-tab active">Videos</div>
        <div className="channel-tab">Shorts</div>
        <div className="channel-tab">Playlists</div>
        <div className="channel-tab">Posts</div>
      </div>
      <div className="channel-videos-list">

        {/* map over videos array state to render video cards on channel */}
        {videos.map(video => (
          <div className="channel-video-card" key={video._id}>
            <Link to={`/video/${video._id}`}>
              <img className="channel-video-thumb" src={video.thumbnail} alt={video.title} />
            </Link>
            <div className="channel-video-info">
              <div className="channel-video-title">{video.title}</div>
              <div className="channel-video-meta">
                <span>{video.views} views</span>
                <span className="channel-dot">·</span>
                <span>{video.uploadDate? new Date(video.uploadDate).toLocaleDateString("en-US", {year: "numeric",month: "long",day: "numeric"}): ""}</span>
              </div>
            </div>
            <div className="channel-video-actions">
              <span
                className="channel-video-meatball"
                tabIndex={0}
                onClick={() => setMenuOpen(menuOpen === video._id ? null : video._id)}
              >

                {/* meatball icons for editing and deleting video */}
                <BsThreeDotsVertical />
                {menuOpen === video._id && (
                  <div className="channel-video-dropdown">
                    <button className="channel-video-dropdown-item" onClick={() => handleEdit(video._id)}>
                      <MdEdit style={{ marginRight: 6 }} /> Edit
                    </button>
                    <button className="channel-video-dropdown-item delete" onClick={() => handleDelete(video._id)}>
                      <MdDelete style={{ marginRight: 6 }} /> Delete
                    </button>
                  </div>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default YourChannel // export yourChannel component