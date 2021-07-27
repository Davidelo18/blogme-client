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

window.addEventListener('DOMContentLoaded', () => {
    /* animowany wielokropek przy ładowaniu postów */
    const $loadingText = document.getElementById('loadingText');
    const originalLoadingText = $loadingText.textContent;

    $loadingText.textContent += '.....';
    $loadingText.style.width = `${$loadingText.offsetWidth + 1}px`; // +1 dla wartości niepełnych
    $loadingText.textContent = originalLoadingText;

    let dotsCount = 1;
    let goingForward = true;

    setInterval(() => {
        let dotsString = '';

        $loadingText.textContent = originalLoadingText;

        if (dotsCount === 5) goingForward = false;
        else if (dotsCount === 1) goingForward = true;

        for (let i = 1; i <= dotsCount; i++) dotsString += '.';
        $loadingText.textContent += dotsString;

        goingForward ? dotsCount++ : dotsCount--;
    }, 200);
});

export default Post;