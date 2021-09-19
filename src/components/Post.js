import React, { useContext } from 'react';
import moment from 'moment';
import 'moment/locale/pl';
import { Link } from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';
import { AuthContext } from '../core/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useQuery, useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { FETCH_POSTS, GET_USER_INFO } from '../core/graphql';

function Post({ post: { id, username, body, publishingTime, plusses, minusses, voteCount } }) {
    const { user } = useContext(AuthContext);

    moment.locale('pl');

    const now = moment();
    let postDate;

    if (moment(publishingTime).diff(now, 'hours') >= -12) {
        postDate = moment(publishingTime).calendar();
    } else {
        postDate = moment(publishingTime).format("D MMMM YYYY | H:mm:ss");
    }

    const { data: { getUserInfo } = {} } = useQuery(GET_USER_INFO, {
        variables: {
            username
        }
    });

    const [plusPost] = useMutation(PLUS_POST, {
        variables: { postId: id }
    });

    const [minusPost] = useMutation(MINUS_POST, {
        variables: { postId: id }
    });

    const [deletePost] = useMutation(DELETE_POST, {
        update(proxy) {
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
        if (window.confirm("Czy na pewno chcesz usunąć ten post?")) {
            if (window.location.href.indexOf("wpis") !== -1) window.location.pathname = "/";
            deletePost();
        }
    }

    return (
        <article className={user.username === username ? "post post--own" : "post"}>
            <div className="post__header">
                <div className="post__avatar">
                    <img src={getUserInfo ? getUserInfo.avatar : "https://blogme.pl/avatar.png"} alt="Avatar użytkownika" />
                </div>
                <div className="post__info">
                    <div className="post__user"><Link to={`/user/${username}`}>{username}</Link></div>
                    <div className="post__date">{postDate}</div>
                </div>
            </div>
            <div className="post__body">{ReactHtmlParser(body)}</div>
            <div className="post__footer">
                <div className="post__vote">
                    <span className={(voteCount >= 0) ? "post__vote-result post__vote-result--positive" : "post__vote-result post__vote-result--negative"}>{voteCount}</span>
                    {user.username !== username && (
                        <React.Fragment>
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
                        </React.Fragment>
                    )}
                </div>

                <div className="post__comments">
                    {user && user.username === username && (
                        <button className="post__delete" onClick={() => deletePostCallback()}><FontAwesomeIcon icon={faTrash} /></button>
                    )}
                    {window.location.pathname === "/" && (<Link className="post__link" to={`/wpis/${id}`}>Komentarze</Link>)}
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