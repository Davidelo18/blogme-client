import React from 'react';
import moment from 'moment';

function Post({ post: { username, body, publishingTime, voteCount } }) {
    return (
        <article className="post">
            <div className="post__header">
                <div className="post__avatar"></div>
                <div className="post__info">
                    <div className="post__user">{username}</div>
                    <div className="post__date">{moment(publishingTime).fromNow()}</div>
                </div>
            </div>
            <div className="post__body">{body}</div>
            <div className="post__footer">
                <div className="post__plusses">{voteCount}</div>
            </div>
        </article>
    )
}

export default Post;