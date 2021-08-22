import React, { useContext, useState } from 'react';
import moment from 'moment';
import 'moment/locale/pl';
import ReactHtmlParser from 'react-html-parser';
import { AuthContext } from '../core/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { FETCH_POSTS } from '../core/graphql';

function Post({ post: { id, username, body, publishingTime, plusses, minusses, voteCount } }) {
    const { user } = useContext(AuthContext);

    moment.locale('pl');

    const now = moment();
    let postDate;

    if (moment(publishingTime).diff(now, 'days') >= 1) {
        postDate = moment(publishingTime).fromNow();
    } else {
        postDate = moment(publishingTime).format("D MMMM YYYY | H:mm:ss");
    }

    const [plusPost] = useMutation(PLUS_POST, {
        variables: { postId: id }
    });

    const [minusPost] = useMutation(MINUS_POST, {
        variables: { postId: id }
    });

    const [confirmOpen, setConfirmOpen] = useState(false);

    const [deletePost] = useMutation(DELETE_POST, {
        update(proxy, result) {
            setConfirmOpen(false);
            const data = proxy.readQuery({
                query: FETCH_POSTS
            });
            proxy.writeQuery({
                query: FETCH_POSTS,
                data: {
                    getPosts: data.getPosts.filter(p => p.id !== id)
                }
            });
        },
        variables: { postId: id }
    });

    function deletePostCallback() {
        if (window.location.href.indexOf("wpis") !== -1) window.location.pathname = "/";
        deletePost()
    }

    return (
        <article className="post">
            <div className="post__header">
                <div className="post__avatar"></div>
                <div className="post__info">
                    <div className="post__user">{username}</div>
                    <div className="post__date">{postDate}</div>
                </div>
            </div>
            <div className="post__body">{ ReactHtmlParser(body) }</div>
            <div className="post__footer">
                <div className="post__vote">
                    <span className={(voteCount >= 0) ? "post__vote-result post__vote-result--positive" : "post__vote-result post__vote-result--negative"}>{voteCount}</span>
                    <button user={user} onClick={plusPost} id="plusBtn" className={
                        plusses.find(plus => plus.username === user.username)
                            ? "post__vote-button post__vote-button--plus voted"
                            : "post__vote-button post__vote-button--plus"
                    }>+</button>
                    <button user={user} onClick={minusPost} id="minusBtn" className={
                        minusses.find(minus => minus.username === user.username)
                            ? "post__vote-button post__vote-button--minus voted"
                            : "post__vote-button post__vote-button--minus"
                    }>-</button>
                </div>

                <div className="post__comments">
                    {user && user.username === username && (
                        <button className="post__delete" onClick={deletePostCallback}><FontAwesomeIcon icon={faTrash} /></button>
                    )}
                    {window.location.pathname === "/" && (<a className="post__link" href={`/wpis/${id}`}>Komentarze</a>)}
                </div>
            </div>
        </article>
    )
}

window.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname === "/") {
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

const PLUS_POST = gql`
    mutation plusPost($postId: ID!){
        plusPost(postId: $postId){
            id
            plusses {
                id username
            }
            minusses {
                id username
            }
            voteCount
        }
    }
`

const MINUS_POST = gql`
    mutation minusPost($postId: ID!){
        minusPost(postId: $postId){
            id
            plusses {
                id username
            }
            minusses {
                id username
            }
            voteCount
        }
    }
`

const DELETE_POST = gql`
    mutation deletePost($postId: ID!){
        deletePost(postId: $postId)
    }
`

export default Post;