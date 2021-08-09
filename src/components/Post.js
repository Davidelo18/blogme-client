import React from 'react';
import moment from 'moment';
import 'moment/locale/pl';

function Post({ post: { username, body, publishingTime, voteCount } }) {
    moment.locale('pl');

    const now = moment();
    let postDate;
    
    if (moment(publishingTime).diff(now, 'days') >= 1) {
        postDate = moment(publishingTime).fromNow();
    } else {
        postDate = moment(publishingTime).format("D MMMM YYYY | H:mm:ss");
    }

    return (
        <article className="post">
            <div className="post__header">
                <div className="post__avatar"></div>
                <div className="post__info">
                    <div className="post__user">{username}</div>
                    <div className="post__date">{ postDate }</div>
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
    if (window.location.href.indexOf("login") === -1) {
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
    }
});

export default Post;