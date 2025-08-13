import React from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns' // import date format (relative dating) from date-fns library
import '../css/homePage.css' // import css for styling

// Video card component for homepage and channel video lists
function Video({ _id, title, channel, views, thumbnail, uploadDate }) {
    return (
        <div className='video'> 
            {/* Thumbnail links to video player */}
            <Link className='video-pic' to={`/Video/${_id}`}>
                <img src={thumbnail} alt={title} className='thumbnail' />
            </Link>
            <div>
                <figure className='channel'>
                    {/* Channel icon links to channel page */}
                    <Link to={`/channels/${channel._id}`}>
                        <img src={channel.channelPic} alt={channel.channelName} className='channel-icon' />
                    </Link>
                </figure>
                <div>
                    {/* Video title links to video player */}
                    <Link to={`/Video/${_id}`}>
                        <div className='video-title'>{title}</div>
                    </Link>
                    {/* Channel name links to channel page */}
                    <Link to={`/channels/${channel._id}`}>
                        <div className='channel-name'>{channel.channelName}</div>
                    </Link>
                    <div className='views'>
                        {views} views

                        {/* show relative time format for upload date */}
                        <span className="video-card-date">
                            {uploadDate
                                ? " • " + formatDistanceToNow(new Date(uploadDate), { addSuffix: true }).replace('about ', '')
                                : ""}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Video // export video component
